import React from 'react';

import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';
import { WebcamLiveWebcamView } from '../components/webcam-live-webcam-view';

export const Webcam = () => (
  <LayoutDashboard>
    <CommonMainContainer>
      <WebcamLiveWebcamView />
    </CommonMainContainer>
  </LayoutDashboard>
);
