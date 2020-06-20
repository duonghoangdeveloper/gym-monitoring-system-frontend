import { SIGN_IN } from '../types/user.type';

const INITIAL_STATE = {
  me: {
    _id: null,
    displayName: null,
    email: null,
    username: null,
  },
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, me: { ...INITIAL_STATE.me, ...action.payload } };
    default:
      return state;
  }
};
