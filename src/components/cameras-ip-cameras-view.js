import { Spin } from 'antd';
import raf from 'raf';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextDecoder } from 'text-encoding';
import { throttle } from 'throttle-debounce';

import { DELAY } from '../common/constants';
import { SocketContext } from '../common/contexts';
import { arrayBufferToBase64, encode } from '../common/services';
import { CamerasEmptyResult } from './cameras-empty-result';
import { CamerasScreen } from './cameras-screen';

export const CamerasIpCamerasView = () => {
  const { socket } = useContext(SocketContext);
  const [screenKeys, setScreenKeys] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const receivedScreens = useRef([]);

  useEffect(() => {
    setTimeout(() => setInitLoading(false), 10000);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit('client-start-view-screens');

    const receiveScreensHandler = throttle(DELAY, true, _receivedScreens => {
      if (
        _receivedScreens.length !== screenKeys.length ||
        _receivedScreens.some(({ key }) => screenKeys.indexOf(key) === -1)
      ) {
        setScreenKeys(_receivedScreens.map(({ key }) => key));
      }

      if (initLoading) {
        setInitLoading(false);
      }

      receivedScreens.current = _receivedScreens;
    });

    const updateScreensHandler = throttle(DELAY, true, () => {
      receivedScreens.current.forEach(({ key, snapshot }) => {
        const img = document.getElementById(key);

        if (img) {
          const arrayBuffer = snapshot.data;
          const bytes = new Uint8Array(arrayBuffer);
          img.src = `data:image/jpeg;base64,${encode(bytes)}`;
        }
      });
    });

    const interval = setInterval(updateScreensHandler, DELAY);

    socket.on('server-send-screens', receiveScreensHandler);

    return () => {
      // raf.cancel(rafId);
      clearInterval(interval);
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
