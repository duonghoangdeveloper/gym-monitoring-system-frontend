import React from 'react';

import { CamerasDetectionView } from '../components/cameras-detection-view';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';

export const CamerasDetection = () => (
  <LayoutDashboard>
    <CommonMainContainer>
      <CamerasDetectionView />
    </CommonMainContainer>
  </LayoutDashboard>
);
