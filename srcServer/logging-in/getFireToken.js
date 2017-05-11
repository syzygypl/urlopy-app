const getFireToken = (fire, claims, username) => fire
  .auth()
  .createCustomToken(username.split('@')[0].replace('.', '_'), claims)
  .catch(error => console.log('Error creating custom token:', error));

module.exports = getFireToken.bind(
  null,
  require('../firebase'),
  {
    scope: 'self, admins',
  },
);
