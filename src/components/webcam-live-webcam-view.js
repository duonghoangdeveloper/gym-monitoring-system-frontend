import { Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { fromEvent } from 'rxjs';

import { SocketContext } from '../common/contexts';
import { encode } from '../common/services';
import { WebcamEmptyResult } from './webcam-empty-result';

export const WebcamLiveWebcamView = () => {
  const { socket } = useContext(SocketContext);
  const [initLoading, setInitLoading] = useState(true);
  const [webcamReceived, setWebcamReceived] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => setInitLoading(false), 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    socket.emit('client-start-get-webcam');

    const handleWebcamGet = ({ webcam }) => {
      if (initLoading) {
        setInitLoading(false);
      }

      if (!webcam?.screenshot?.data === webcamReceived) {
        setWebcamReceived(!!webcam?.screenshot?.data);
      }

      if (webcam?.screenshot?.data) {
        const arrayBuffer = webcam.screenshot.data;
        const bytes = new Uint8Array(arrayBuffer);
        ref.current.src = `data:image/jpeg;base64,${encode(bytes)}`;
      }
      socket.emit('client-get-webcam-succeeded');
    };
    const observable = fromEvent(socket, 'server-send-webcam');
    const subscriber = observable.subscribe({
      next(webcam) {
        handleWebcamGet(webcam);
      },
    });

    return () => {
      socket.emit('client-stop-get-webcam');
      socket.off('server-send-webcam');
      subscriber.unsubscribe();
    };
  }, [socket.connected, initLoading, webcamReceived]);

  if (initLoading) {
    return (
      <div className="w-full flex justify-center">
        <Spin />
      </div>
    );
  }

  if (!webcamReceived) {
    return <WebcamEmptyResult />;
  }

  return (
    <img
      alt="webcam"
      className="rounded-sm w-full"
      ref={ref}
      src="video-placeholder.png"
    />
  );
};
