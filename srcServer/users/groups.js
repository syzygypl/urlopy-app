const R = require('ramda');

const dnToCapitalizedFullName = require('./dnToCapitalizedFullName');

const findGroupsOpts = {
  filter: '(cn=*:head)',
  scope: 'sub',
};

const toLeadersFullNames = data =>
  Object
    .values(data)
    .map(dnToCapitalizedFullName)
    .map(fullName => `(cn=${fullName})`)
    .join('');

const extendGroups = (entry, groups, leaderAndGroup) => {
  const entryObj = entry.object;
  const leaderDN = entryObj.dn.toLowerCase();
  const groupName = leaderAndGroup[leaderDN];

  return Object.assign({}, groups, {
    [groupName]: {
      name: groupName,
      leaderID: entryObj.uid.replace('.', '_'),
      leaderCN: entryObj.cn,
      leaderUID: entryObj.uid,
    },
  });
};

const collectGroups = (err, ldapRes) => new Promise((resolve) => {
  let groups = {};

  ldapRes
    .on('searchEntry', (entry) => {
      const entryObj = entry.object;
      const groupHead = entryObj.uniqueMember[1];
      const groupName = entryObj.cn.split(':')[0];

      groups = Object.assign({}, groups, {
        [groupName]: groupHead,
      });
    })
    .on('end', () => resolve(groups));
});

const findGroupLeader = (ldap, data) => {
  let groups = {};

  const leaderAndGroup = R.invertObj(data);

  return new Promise((resolve, reject) => {
    ldap.search(
      'o=ArsThanea,dc=arsthanea,dc=com',
      {
        scope: 'sub',
        filter: `(|${toLeadersFullNames(data)})`,
      },
      (err, ldapRes) => {
        ldapRes
          .on('error', ldapErr => reject(ldapErr))
          .on('end', () => resolve(groups))
          .on('searchEntry', (entry) => {
            groups = extendGroups(entry, groups, leaderAndGroup);
          });
      });
  });
};

const collectGroupsAndLeaders = (ldap, err, ldapRes) =>
  collectGroups(err, ldapRes).then(findGroupLeader.bind(null, ldap));

module.exports = {
  findGroupsOpts, collectGroupsAndLeaders,
};
