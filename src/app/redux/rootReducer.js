import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
});

export default rootReducer;
