import { Spin } from 'antd';
import { encode } from 'base64-arraybuffer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { CamerasEmptyResult } from './cameras-empty-result';
import { CamerasScreen } from './cameras-screen';

export const CamerasLiveCamerasView = () => {
  const { socket } = useContext(SocketContext);
  const [cameraKeys, setCameraKeys] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const loading = useRef(false);

  useEffect(() => {
    socket.removeAllListeners();
    const timeoutId = setTimeout(() => setInitLoading(false), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  console.log(123)

  useEffect(() => {
    socket.emit('client-start-get-cameras');

    const handleCamerasGet = ({ cameras }) => {
      loading.current = true;
      if (
        cameras.length !== cameraKeys.length ||
        cameras.some(({ key }) => cameraKeys.indexOf(key) === -1)
      ) {
        setCameraKeys(cameras.map(({ key }) => key));
      }

      if (initLoading) {
        setInitLoading(false);
      }

      cameras.forEach(({ key, screenshot }) => {
        const img = document.getElementById(key);

        if (img) {
          img.src = `data:image/jpeg;base64,${encode(screenshot.data)}`;
        }
      });
      socket.emit('client-get-cameras-succeeded');
      loading.current = false;
    };
    const observable = fromEvent(socket, 'server-send-cameras');
    const subscriber = observable.subscribe({
      next(cameras) {
        if (!loading.current) {
          handleCamerasGet(cameras);
        }
      },
    });

    return () => {
      socket.emit('client-stop-get-cameras');
      socket.off('server-send-cameras');
      subscriber.unsubscribe();
    };
  }, [socket.connected, initLoading, cameraKeys]);

  if (initLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spin />
      </div>
    );
  }

  if (cameraKeys.length === 0) {
    return <CamerasEmptyResult />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '0.25rem 0.25rem',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(calc(50% - 0.25rem), 1fr))',
      }}
    >
      {cameraKeys.map(cameraKey => (
        <CamerasScreen cameraKey={cameraKey} key={cameraKey} />
      ))}
    </div>
  );
};
