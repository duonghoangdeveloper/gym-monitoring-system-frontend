import {
  SET_FACES_LAYOUT,
  SET_OPEN_KEYS,
  TOGGLE_AUTO_DETECT,
  TOGGLE_COLLAPSED,
  TOGGLE_WEBCAM_VISIBLE,
} from './common.types';

const INITIAL_STATE = {
  sider: {
    collapsed: false,
    openKeys: ['user-management', 'monitoring'],
  },
  userWebcam: {
    autoDetect: true,
    facesLayout: 'FLEX',
    webcamVisible: true,
  },
};

export const commonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSED:
      return {
        ...state,
        sider: { ...state.sider, collapsed: !state.sider.collapsed },
      };
    case SET_OPEN_KEYS:
      return {
        ...state,
        sider: {
          ...state.sider,
          openKeys: action.payload.openKeys,
        },
      };

    case TOGGLE_AUTO_DETECT:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          autoDetect: !state.userWebcam.autoDetect,
        },
      };
    case TOGGLE_WEBCAM_VISIBLE:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          webcamVisible: !state.userWebcam.webcamVisible,
        },
      };
    case SET_FACES_LAYOUT:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          facesLayout: action.payload.facesLayout,
        },
      };
    default:
      return state;
  }
};
