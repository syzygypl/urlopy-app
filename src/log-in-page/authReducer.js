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

const reducer = (possibleStates, state = notAuthenticated, action) => {
  const possibleState = possibleStates[action.type];
  const addToken = existingState => Object.assign({}, existingState, { token: action.payload });

  return possibleState ? addToken(possibleState) : state;
};

export default reducer.bind(null, states);
