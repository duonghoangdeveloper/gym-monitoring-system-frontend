import { Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { throttle } from 'throttle-debounce';

import { SocketContext } from '../common/contexts';
import { CamerasEmptyResult } from './cameras-empty-result';
import { CamerasScreen } from './cameras-screen';

export const CamerasIpCamerasView = () => {
  const { socket } = useContext(SocketContext);
  const [screenKeys, setScreenKeys] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setInitLoading(false), 10000);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit('client-start-view-screens');

    const receiveScreensHandler = throttle(250, true, receivedScreens => {
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
          img.src = `data:image/jpeg;base64,${snapshot}`;
        }
      });
    });

    socket.on('server-send-screens', receiveScreensHandler);

    return () => {
      socket.emit('client-stop-view-screens');
      socket.off('server-send-screens');
    };
  }, [initLoading, screenKeys]);

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
