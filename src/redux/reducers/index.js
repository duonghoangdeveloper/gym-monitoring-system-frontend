import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { userReducer } from './user.reducer';

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['me'],
};

export const rootReducer = combineReducers({
  hello: userReducer,
  user: persistReducer(userPersistConfig, userReducer),
});
