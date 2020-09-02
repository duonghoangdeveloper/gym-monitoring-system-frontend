import {
  LINE_LABELLING_SET_DOWNLOAD_IMAGE_SIZE,
  LINE_LABELLING_SET_PREVIEW_IMAGE_SIZE,
  SIDER_SET_OPEN_KEYS,
  SIDER_TOGGLE_COLLAPSED,
  USER_WEBCAM_SET_FACES_LAYOUT,
  USER_WEBCAM_TOGGLE_AUTO_DETECT,
  USER_WEBCAM_TOGGLE_WEBCAM_VISIBLE,
} from './common.types';

const INITIAL_STATE = {
  lineLabelling: {
    downloadImageSize: 128,
    previewImageSize: 384,
  },
  sider: {
    collapsed: false,
    openKeys: [],
  },
  userWebcam: {
    autoDetect: false,
    facesLayout: 'FLEX',
    webcamDesktop: true,
    webcamVisible: true,
  },
};

export const commonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LINE_LABELLING_SET_DOWNLOAD_IMAGE_SIZE:
      return {
        ...state,
        lineLabelling: {
          ...state.lineLabelling,
          downloadImageSize: action.payload.downloadImageSize,
        },
      };
    case LINE_LABELLING_SET_PREVIEW_IMAGE_SIZE:
      return {
        ...state,
        lineLabelling: {
          ...state.lineLabelling,
          previewImageSize: action.payload.previewImageSize,
        },
      };
    case SIDER_SET_OPEN_KEYS:
      return {
        ...state,
        sider: {
          ...state.sider,
          openKeys: action.payload.openKeys,
        },
      };
    case SIDER_TOGGLE_COLLAPSED:
      return {
        ...state,
        sider: { ...state.sider, collapsed: !state.sider.collapsed },
      };
    case USER_WEBCAM_SET_FACES_LAYOUT:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          facesLayout: action.payload.facesLayout,
        },
      };
    case USER_WEBCAM_TOGGLE_AUTO_DETECT:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          autoDetect: !state.userWebcam.autoDetect,
        },
      };
    case USER_WEBCAM_TOGGLE_WEBCAM_VISIBLE:
      return {
        ...state,
        userWebcam: {
          ...state.userWebcam,
          webcamVisible: !state.userWebcam.webcamVisible,
        },
      };
    default:
      return state;
  }
};
