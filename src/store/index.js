import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';

import rootReducer from '../rootReducer';

const config = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  databaseURL: '<your-database-url>',
  storageBucket: '<your-storage-bucket>',
};

const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(
    applyMiddleware(
      thunk.withExtraArgument(getFirebase),
    ),
    reactReduxFirebase(config, { userProfile: 'users', enableLogging: false }),
  ),
);

export default store;
