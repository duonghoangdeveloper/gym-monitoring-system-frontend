import React from 'react';
import io from 'socket.io-client';

import { URI } from '../common/constants';
import { SocketContext } from '../common/contexts';

export const AppSocketWrapper = ({ children }) => (
  <SocketContext.Provider
    value={{
      socket: io.connect(URI),
    }}
  >
    {children}
  </SocketContext.Provider>
);
