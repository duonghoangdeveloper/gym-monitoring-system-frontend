import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { commonReducer } from './common.reducer';
import { userReducer } from './user.reducer';

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['me'],
};

export const rootReducer = combineReducers({
  common: commonReducer,
  user: persistReducer(userPersistConfig, userReducer),
});
