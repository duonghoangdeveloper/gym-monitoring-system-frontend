import { SET_OPEN_KEYS, TOGGLE_COLLAPSED } from '../types/common.types';

const INITIAL_STATE = {
  sider: {
    collapsed: false,
    openKeys: ['user-management'],
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
    default:
      return state;
  }
};
