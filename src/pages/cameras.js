import React from 'react';

import { CamerasIpCamerasView } from '../components/cameras-ip-cameras-view';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Cameras = () => (
  <LayoutDashboard>
    <CommonMainContainer>
      <CamerasIpCamerasView />
    </CommonMainContainer>
  </LayoutDashboard>
);
