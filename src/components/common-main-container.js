import React from 'react';

export const CommonMainContainer = ({ children, ...rest }) => (
  <div
    className="bg-white shadow p-6 rounded-sm"
    style={{
      minHeight: 'calc(100vh - 64px - 3rem)',
    }}
    {...rest}
  >
    {children}
  </div>
);
