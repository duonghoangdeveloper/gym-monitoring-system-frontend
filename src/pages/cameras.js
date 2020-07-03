import { VideoCameraOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState } from 'react';
import { RiWebcamLine } from 'react-icons/ri';

import { CamerasIpCamerasView } from '../components/cameras-ip-cameras-view';
import { CamerasWebcamsView } from '../components/cameras-webcams-view';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Cameras = () => {
  const [selectedKey, setSelectedKey] = useState('cameras');

  const getTab = key => {
    switch (key) {
      case 'cameras':
        return <CamerasIpCamerasView />;
      case 'webcams':
        return <CamerasWebcamsView />;
      default:
        return null;
    }
  };

  return (
    <LayoutDashboard>
      <div
        className="bg-white shadow rounded-sm flex py-6"
        style={{
          minHeight: 'calc(100vh - 64px - 3rem)',
        }}
      >
        <Menu
          // onClick={this.handleClick}
          mode="inline"
          onSelect={({ key }) => setSelectedKey(key)}
          selectedKeys={[selectedKey]}
          style={{ width: 256 }}
        >
          <Menu.Item icon={<VideoCameraOutlined />} key="cameras">
            IP Cameras
          </Menu.Item>
          <Menu.Item
            icon={
              <span aria-label="video-camera" className="anticon" role="img">
                <RiWebcamLine />
              </span>
            }
            key="webcams"
          >
            Webcams
          </Menu.Item>
        </Menu>
        <div className="flex-1 px-6">{getTab(selectedKey)}</div>
      </div>
    </LayoutDashboard>
  );
};
