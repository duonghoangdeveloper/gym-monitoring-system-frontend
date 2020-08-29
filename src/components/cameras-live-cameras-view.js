import { Spin } from 'antd';
import { encode } from 'base64-arraybuffer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { CamerasEmptyResult } from './cameras-empty-result';
import { CamerasScreen } from './cameras-screen';

export const CamerasLiveCamerasView = () => {
  const { socket } = useContext(SocketContext);
  const [cameraIds, setCameraIds] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const loading = useRef(false);

  useEffect(() => {
    socket.removeAllListeners();
    const timeoutId = setTimeout(() => setInitLoading(false), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  console.log(123);

  useEffect(() => {
    socket.emit('client-start-get-cameras');

    const handleCamerasGet = ({ cameras }) => {
      loading.current = true;
      if (
        cameras.length !== cameraIds.length ||
        cameras.some(({ _id }) => cameraIds.indexOf(_id) === -1)
      ) {
        setCameraIds(cameras.map(({ _id }) => _id));
      }

      if (initLoading) {
        setInitLoading(false);
      }

      cameras.forEach(({ _id, screenshot }) => {
        const img = document.getElementById(_id);

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
  }, [socket.connected, initLoading, cameraIds]);

  if (initLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spin />
      </div>
    );
  }

  if (cameraIds.length === 0) {
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
      {cameraIds.map(_id => (
        <CamerasScreen _id={_id} key={_id} />
      ))}
    </div>
  );
};
