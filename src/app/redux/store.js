import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from './rootReducer';

export const history = createHistory();

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(
    applyMiddleware(
      thunk.withExtraArgument(getFirebase),
      routerMiddleware(history),
    ),
    reactReduxFirebase(config, { userProfile: 'users', enableLogging: false }),
  ),
);

export default store;
