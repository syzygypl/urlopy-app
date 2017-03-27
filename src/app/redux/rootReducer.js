import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { firebaseStateReducer } from 'react-redux-firebase';

import auth from '../../log-in-page/authReducer';
import rowsReducer from '../../vacations-requests/Vacations/rowsReducer';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  form: formReducer,
  sortRowsBy: rowsReducer,
  currentUserID: () => 'sancho',
  auth,
});

export default rootReducer;
