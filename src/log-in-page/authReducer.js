// Action creators

export const requestLogin = redirectURL => ({ type: 'LOGIN_REQUESTED', payload: { redirectURL } });
export const startLogin = () => ({ type: 'LOGGING_IN' });
export const loginError = () => ({ type: 'LOGGING_IN_ERROR' });
export const loginSuccess = () => ({ type: 'LOGGING_IN_SUCCESS' });

const states = {
  LOGIN_REQUESTED: payload => payload,
  LOGGING_IN: () => ({ info: 'Trwa logowanie...' }),
  LOGGING_IN_ERROR: () => ({ info: 'Nazwa użytkownika lub hasło nieprawidłowe' }),
  LOGGING_IN_SUCCESS: () => ({}),
};

const reducer = (possibleStates, state = {}, action) => {
  let newState = {
    ...state,
    ...((possibleStates[action.type] && possibleStates[action.type](action.payload)) || state),
  };

  if (action.type === 'LOGGING_IN_SUCCESS') {
    newState = states[action.type]();
  }

  return newState;
};

export default reducer.bind(null, states);
