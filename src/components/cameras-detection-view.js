import { Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { CamerasDetectionScreen } from './cameras-detection-screen';
import { CamerasEmptyResult } from './cameras-empty-result';

export const CamerasDetectionView = () => {
  const { socket } = useContext(SocketContext);
  const [cameras, setCameras] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const loading = useRef(false);

  useEffect(() => {
    socket.removeAllListeners();
    const timeoutId = setTimeout(() => setInitLoading(false), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    socket.emit('client-start-get-cameras-detection');

    const handleCamerasDetectionGet = ({ cameras: _cameras }) => {
      loading.current = true;
      setCameras(
        _cameras.map(({ _id, detectionData }) => ({
          _id,
          detectionData,
        }))
      );

      if (initLoading) {
        setInitLoading(false);
      }
      socket.emit('client-get-cameras-detection-succeeded');
      loading.current = false;
    };
    const observable = fromEvent(socket, 'server-send-cameras-detection');
    const subscriber = observable.subscribe({
      next(data) {
        if (!loading.current) {
          handleCamerasDetectionGet(data);
        }
      },
    });

    return () => {
      socket.emit('client-stop-get-cameras-detection');
      socket.off('server-send-cameras-detection');
      subscriber.unsubscribe();
    };
  }, [socket.connected, initLoading]);

  if (initLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spin />
      </div>
    );
  }

  if (cameras.length === 0) {
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
      {cameras.map(({ _id, detectionData }) => (
        <CamerasDetectionScreen detectionData={detectionData} key={_id} />
      ))}
    </div>
  );
};
