import { SIGN_IN, SIGN_OUT, UPDATE_PROFILE, USERS } from '../types/user.types';

const INITIAL_STATE = {
  me: {
    _id: null,
    displayName: null,
    email: null,
    role: null,
    username: null,
  },
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, me: { ...INITIAL_STATE.me, ...action.payload } };
    case SIGN_OUT:
      return { ...state, me: { ...INITIAL_STATE.me } };
    case UPDATE_PROFILE:
      return { ...state, me: { ...state.me, ...action.payload } };
    case USERS:
      return { ...state, me: { ...state.me, ...action.payload } };
    default:
      return state;
  }
};
