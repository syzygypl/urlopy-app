const notAuthenticated = {
  isAuthenticated: false,
};

const states = {
  LOGGING_IN: notAuthenticated,
  LOGGING_IN_ERROR: Object.assign({}, notAuthenticated, { reason: 'Nazwa użytkownika lub hasło nieprawidłowe' }),
  LOGGING_IN_SUCCESS: {
    isAuthenticated: true,
  },
};

const reducer =
  (possibleStates, state = notAuthenticated, action) =>
  possibleStates[action.type] || state;

export default reducer.bind(null, states);
