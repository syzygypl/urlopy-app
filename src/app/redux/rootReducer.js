import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  form: formReducer,
});

export default rootReducer;
