import { Result } from 'antd';
import React from 'react';
import { RiWebcamLine } from 'react-icons/ri';

export const WebcamEmptyResult = () => (
  <Result
    icon={
      <span aria-label="video-camera" className="anticon" role="img">
        <RiWebcamLine />
      </span>
    }
    subTitle="Check eGMS desktop app and make sure it's streaming."
    title="Don't receive any stream!"
  />
);
