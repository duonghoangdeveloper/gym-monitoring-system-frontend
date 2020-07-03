import { VideoCameraOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React from 'react';

export const CamerasEmptyResult = () => (
  <Result
    icon={<VideoCameraOutlined />}
    subTitle="Check eGMS desktop app and make sure it's streaming."
    title="Don't receive any stream!"
  />
);
