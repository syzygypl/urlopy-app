const { collectUsers, findUsersOpts } = require('./users');
const { findGroupsOpts, collectGroupsAndLeaders } = require('./groups');
const { collectGroupsMembers, findGroupsMembersOpts } = require('./members');

const ldap = require('ldapjs')
  .createClient({
    url: process.env.LDAP_URL,
  });

const searchIn = (ldapClient, ldapSearchOpts, ldapResHandler, base, req, res) => {
  ldapClient.search(
    base,
    ldapSearchOpts,
    (err, ldapRes) => ldapResHandler(err, ldapRes).then(res.send.bind(res)),
  );
};

const searchInLDAP = searchIn.bind(null, ldap);

module.exports = (
  require('express').Router()
    .get('/users', searchInLDAP.bind(null, findUsersOpts, collectUsers, 'o=ArsThanea,dc=arsthanea,dc=com'))
    .get('/groups', searchInLDAP.bind(null, findGroupsOpts, collectGroupsAndLeaders.bind(null, ldap), 'dc=arsthanea,dc=com'))
    .get('/groups-members', searchInLDAP.bind(null, findGroupsMembersOpts, collectGroupsMembers.bind(null, ldap), 'dc=arsthanea,dc=com'))
    .post('/vacations/')
);
