import React from 'react';

import { CamerasLiveCamerasView } from '../components/cameras-live-cameras-view';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Cameras = () => (
  <LayoutDashboard>
    <CommonMainContainer>
      <CamerasLiveCamerasView />
    </CommonMainContainer>
  </LayoutDashboard>
);
