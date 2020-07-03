import React from 'react';

export const CamerasScreen = ({ cameraKey }) => (
  <div className="w-full self-center">
    <div
      className="relative p-1"
      style={{
        paddingTop: '56.25%',
      }}
    >
      <div className="absolute inset-0 m-1">
        <img
          alt={cameraKey}
          className="rounded-sm"
          id={cameraKey}
          src="video-placeholder.png"
        />
      </div>
    </div>
  </div>
);
