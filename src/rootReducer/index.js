import { firebaseStateReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
});

export default state => state;
