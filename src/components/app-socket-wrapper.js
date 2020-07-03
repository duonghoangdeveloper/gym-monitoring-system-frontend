import React from 'react';
import io from 'socket.io-client';

import { SocketContext } from '../common/contexts';

export const AppSocketWrapper = ({ children }) => (
  <SocketContext.Provider
    value={{
      socket: io.connect('http://localhost:7777'),
    }}
  >
    {children}
  </SocketContext.Provider>
);
