import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';

import { rootReducer } from './reducers';

const composeEnhancer = composeWithDevTools({});

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware())
);
export const persistor = persistStore(store);
