import { TOGGLE_COLLAPSED } from '../types/common.types';

const INITIAL_STATE = {
  sider: {
    collapsed: false,
    openKeys: ['user-management'],
    selectedKeys: ['staffs'],
  },
};

export const commonReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_COLLAPSED:
      return {
        ...state,
        sider: { ...state.sider, collapsed: !state.sider.collapsed },
      };
    default:
      return state;
  }
};
