import { Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { encode } from '../common/services';
import { CamerasEmptyResult } from './cameras-empty-result';
import { CamerasScreen } from './cameras-screen';

export const CamerasIpCamerasView = () => {
  const { socket } = useContext(SocketContext);
  const [screenKeys, setScreenKeys] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setInitLoading(false), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    socket.emit('client-start-view-screens');

    const receiveScreensHandler = receivedScreens => {
      if (
        receivedScreens.length !== screenKeys.length ||
        receivedScreens.some(({ key }) => screenKeys.indexOf(key) === -1)
      ) {
        setScreenKeys(receivedScreens.map(({ key }) => key));
      }

      if (initLoading) {
        setInitLoading(false);
      }

      receivedScreens.forEach(({ key, snapshot }) => {
        const img = document.getElementById(key);

        if (img) {
          const arrayBuffer = snapshot.data;
          const bytes = new Uint8Array(arrayBuffer);
          img.src = `data:image/jpeg;base64,${encode(bytes)}`;
        }
      });
      socket.emit('client-receive-screens');
    };
    const observable = fromEvent(socket, 'server-send-screens');
    const subscriber = observable.subscribe({
      next(receivedScreens) {
        receiveScreensHandler(receivedScreens);
      },
    });

    return () => {
      socket.emit('client-stop-view-screens');
      socket.off('server-send-screens');
      subscriber.unsubscribe();
    };
  }, [socket.connected, initLoading, screenKeys]);

  if (initLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spin />
      </div>
    );
  }

  if (screenKeys.length === 0) {
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
      {screenKeys.map(screenKey => (
        <CamerasScreen cameraKey={screenKey} key={screenKey} />
      ))}
    </div>
  );
};
