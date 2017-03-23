import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import { reducer as formReducer } from 'redux-form';
import rowsReducer from '../../vacations-requests/Vacations/rowsReducer';

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  form: formReducer,
  sortRowsBy: rowsReducer,
});

export default rootReducer;
