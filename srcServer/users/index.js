const ldap = require('ldapjs');

const valsToString = obj => obj._vals.toString();

const transformOrEmptyString = (transform, entity) => (entity ? transform(entity) : '');

const toString = transformOrEmptyString.bind(null, valsToString);

const onSearch = (response, resolve) => {
  let people = [];

  response.on('searchEntry', (entry) => {
    const group = entry.dn.split(',')
      .filter(dnParts => dnParts.startsWith('ou'))
      .map(ouParts => ouParts.replace('ou=', ''))
      .filter(groupType => groupType !== 'people')
      .join('');

    people = people.concat({ dn: entry.dn, group });
  });

  response.on('end', () => resolve(people));
};

const transformAttrOfType = (attrs, transform, attrType) => {
  const attrOfType = attrs.filter(attribute => attribute.type === attrType);

  return transform(attrOfType[0]);
};

const getPersonInfo = (client, userDN) =>
  new Promise((resolve) => {
    client.search(userDN, { scope: 'sub' }, (err, res) => {
      res.on('searchEntry', (entry) => {
        const toStringFromAttrOfType = transformAttrOfType.bind(null, entry.attributes, toString);

        resolve({
          cn: toStringFromAttrOfType('cn'),
          uid: toStringFromAttrOfType('uid'),
          mail: toStringFromAttrOfType('mail'),
        });
      });
    });
  });

const findPeople = (searchResHandler, criteria, ldapClient, opts) =>
  new Promise(
    resolve => ldapClient.search(criteria, opts, (err, res) => searchResHandler(res, resolve)),
  );

const findPeopleAndTheirGroups = findPeople.bind(null, onSearch);

const addInfoAboutPeople = (ldapClient, people) =>
  people.map(
    person => getPersonInfo(ldapClient, person.dn)
      .then(personInfo => Object.assign({}, { group: person.group }, personInfo))
      .catch(() => person),
  );

const getUsersHandler = (req, res) => {
  const ldapClient = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  const opts = {
    filter: '(&(objectClass=person))',
    scope: 'sub',
    attributes: ['dn', 'sn', 'cn'],
  };

  findPeopleAndTheirGroups('o=ArsThanea, dc=arsthanea, dc=com', ldapClient, opts, onSearch)
    .then(addInfoAboutPeople.bind(null, ldapClient))
    .then(Promise.all.bind(Promise))
    .then(res.send.bind(res));
};

module.exports = require('express').Router().get('/users', getUsersHandler);
