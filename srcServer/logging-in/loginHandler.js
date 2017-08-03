const bindToLDAP = require('./bindToLDAP');
const getFireToken = require('./getFireToken');
const getEntryDataFromLDAP = require('./getEntryDataFromLDAP');

const noAuth = (res, e) => res.status(401).send(e);

export default (ldap, req, res) => {
  const ldapClient = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  const username = req.body.username;

  const opts = {
    filter: `(|(uid=${username})(mail=${username}))`,
    scope: 'sub',
  };

  getEntryDataFromLDAP(ldapClient, opts)
    .then(entry => bindToLDAP(ldapClient, entry.dn, req.body.password))
    .catch(e => noAuth(res, e))
    .then(ldapConnection =>
      getFireToken(username)
        .then(customToken => res.status(200).send(customToken))
        .then(() => ldapConnection),
    )
    .then(({ client }) => client.unbind())
    .catch(e => noAuth(res, e));
};
