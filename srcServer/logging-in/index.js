const ldap = require('ldapjs');
const router = require('express').Router();

const fire = require('../firebase');
const createDN = require('./createDN');
const connectToLDAP = require('./connectToLDAP');

const claims = {
  scope: 'self, admins',
};

router.post('/login', (req, res) => {
  const dn = createDN(req.body.username);

  const ldapClient = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  connectToLDAP(ldapClient, dn, req.body.password)
    .then(({ client }) => fire
      .auth()
      .createCustomToken(req.body.username, claims)
      .then(customToken => res.status(200).send(customToken))
      .catch(error => console.log('Error creating custom token:', error))
      .then(() => client),
    )
    .catch(({ client }) => {
      res.status(401).send(false);

      return client;
    })
    .then(client => client.unbind());
});

module.exports = router;
