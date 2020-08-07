import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { commonReducer } from './common/common.reducer';
import { userReducer } from './user/user.reducer';

const commonPersistConfig = {
  key: 'common',
  storage,
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['me'],
};

export const rootReducer = combineReducers({
  common: persistReducer(commonPersistConfig, commonReducer),
  user: persistReducer(userPersistConfig, userReducer),
});

const composeEnhancer = composeWithDevTools({});

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware())
);
export const persistor = persistStore(store);
