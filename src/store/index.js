import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reactReduxFirebase } from 'react-redux-firebase';

import rootReducer from '../rootReducer';

const middleware = [thunk];

const config = {
  apiKey: '<your-api-key>',
  authDomain: '<your-auth-domain>',
  databaseURL: '<your-database-url>',
  storageBucket: '<your-storage-bucket>',
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(config, { userProfile: 'users' }),
)(createStore);

export default createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware),
  ),
);
