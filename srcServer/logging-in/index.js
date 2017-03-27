const ldap = require('ldapjs');
const router = require('express').Router();

const createDN = require('./createDN');
const connectToLDAP = require('./connectToLDAP');

const ldapAddress = 'ldap://stor';

router.post('/login', (req, res) => {
  const dn = createDN(req.body.username);

  const ldapClient = ldap.createClient({
    url: ldapAddress,
  });

  connectToLDAP(ldapClient, dn, req.body.password)
    .then(({ client }) => {
      res.status(200).send(true);

      return client;
    })
    .catch(({ client }) => {
      res.status(401).send(false);

      return client;
    })
    .then(client => client.unbind());
});

module.exports = router;
