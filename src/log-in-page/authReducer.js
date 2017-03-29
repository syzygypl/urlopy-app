const states = {
  LOGGING_IN: { info: 'Trwa logowanie...' },
  LOGGING_IN_ERROR: { info: 'Nazwa użytkownika lub hasło nieprawidłowe' },
  LOGGING_IN_SUCCESS: {},
};

const reducer = (possibleStates, state = {}, action) => possibleStates[action.type] || state;

export default reducer.bind(null, states);
