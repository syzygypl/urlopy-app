// actions and action creators related to vacation
import axios from 'axios';
import formatDate from 'date-fns/format';
import {
  getFormValues,
  startSubmit,
  stopSubmit,
} from 'redux-form';

import { push } from 'react-router-redux';

import { formName } from './meta';

export const sendVacationRequest = () => {
  return (dispatch, getState) => {
    dispatch(startSubmit(formName));

    const formData = getFormValues(formName)(getState()) || {};

    // format vacation days for easier processing by the API
    const vacationDays = formData.vacationDays && formData.vacationDays.length > 0
      ? formData.vacationDays.map(vacation => ({
        from: formatDate(vacation.range[0], 'YYYY-MM-DD'),
        to: formatDate(vacation.range[1], 'YYYY-MM-DD'),
        workDays: vacation.workingDays,
      }))
      : [];

    const vacationRequestData = {
      requestForUser: formData.requestForUser ? formData.requestForUser.value : null,
      notifyUser: formData.notifyUser ? formData.notifyUser.value : null,
      vacationDays,
      notes: formData.notes,
    };

    // send data to the internal API
    axios.post(`${process.env.REACT_APP_INTERNAL_API_URL}/vacations/`, vacationRequestData).then((response) => {
      if (response.data.status !== 'OK') {
        dispatch(stopSubmit(formName, {
          _error: response.data.message,
        }));
      } else {
        // vacation request was added successfully
        dispatch(stopSubmit(formName));
        // @TODO change route to list
        dispatch(push('/'));
      }
    });
  };
};
