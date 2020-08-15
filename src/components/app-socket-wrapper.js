import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { URI } from '../common/constants';
import { SocketContext } from '../common/contexts';

export const AppSocketWrapper = ({ children }) => {
  const [socket, setSocket] = useState(io.connect(URI));

  useEffect(() => {
    const intervalId = setInterval(() => {
      try {
        if (!socket) {
          setSocket(io.connect(URI));
        } else if (!socket.connected) {
          socket.connect();
        }
      } catch (_) {
        // Do nothing
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
