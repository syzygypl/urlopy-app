import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { firebaseStateReducer } from 'react-redux-firebase';
import { routerReducer } from 'react-router-redux';

import auth from '../../log-in-page/authReducer';
import rowsReducer from '../../vacations-requests/Vacations/rowsReducer';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  form: formReducer,
  sortRowsBy: rowsReducer,
  auth,
  routing: routerReducer,
});

export default rootReducer;
