import React from 'react';

export const CamerasScreen = ({ _id, detectionData }) => {
  console.log(detectionData);

  return (
    <div className="w-full self-center">
      <div
        className="relative p-1"
        style={{
          paddingTop: '56.25%',
        }}
      >
        <div className="absolute inset-0 m-1">
          <img
            alt={_id}
            className="rounded-sm"
            id={_id}
            src="video-placeholder.png"
          />
        </div>
      </div>
    </div>
  );
};
