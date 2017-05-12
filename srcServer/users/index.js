const ldap = require('ldapjs')
  .createClient({
    url: process.env.LDAP_URL,
  });

const getGroup = dn =>
  dn.split(',')
    .filter(dnParts => dnParts.startsWith('ou'))
    .map(ouParts => ouParts.replace('ou=', ''))
    .filter(groupType => groupType !== 'people')
    .join('');

const collectUsers = (err, ldapRes) => new Promise((resolve) => {
  let obj = {};

  ldapRes.on('searchEntry', (entry) => {
    obj = Object.assign({}, obj, {
      [entry.object.uid.replace('.', '_')]: {
        name: entry.object.cn,
        uid: entry.object.uid,
        mail: entry.object.mail,
        group: getGroup(entry.object.dn),
        cn: entry.object.cn,
      },
    });
  });

  ldapRes.on('end', () => {
    resolve(obj);
  });
});

const getUsersHandler = (ldapClient, req, res) => {
  const opts = {
    filter: '(&(objectClass=person))',
    scope: 'sub',
  };

  ldapClient.search(
    'o=ArsThanea,dc=arsthanea,dc=com',
    opts,
    (err, response) => collectUsers(err, response).then(res.send.bind.res),
  );
};

module.exports = require('express').Router().get('/users', getUsersHandler.bind(null, ldap));
