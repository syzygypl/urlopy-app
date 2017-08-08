const { sendVacationRequestNotification } = require('./MailSender');

module.exports = (
  require('express').Router()
    .get('/mail', searchInLDAP.bind(null, findUsersOpts, collectUsers, 'o=ArsThanea,dc=arsthanea,dc=com'))
    .get('/groups', searchInLDAP.bind(null, findGroupsOpts, collectGroupsAndLeaders.bind(null, ldap), 'dc=arsthanea,dc=com'))
    .get('/groups-members', searchInLDAP.bind(null, findGroupsMembersOpts, collectGroupsMembers.bind(null, ldap), 'dc=arsthanea,dc=com'))
);
