const R = require('ramda');

const findGroupsMembersOpts = {
  filter: '(cn=*\ Members)',
  scope: 'sub',
};

const getCNs = require('./getCNs');

const addGroupsMembersData = (ldap, allGroups) => {
  let groups = R.mapObjIndexed(() => ({}), allGroups);

  const groupsWithMembersBeingLoaded = R.mapObjIndexed(
    (val, key) => new Promise((resolve, reject) => ldap.search(
      'o=ArsThanea,dc=arsthanea,dc=com',
      {
        scope: 'sub',
        filter: `(|${val})`,
      },
      (_, ldapRes) => {
        ldapRes
          .on('error', reject)
          .on('searchEntry', (entry) => {
            const myLens = R.lensPath([key, entry.object.uid.replace('.', '_')]);

            groups = R.set(myLens, ({ cn: entry.object.cn }), groups);
          })
          .on('end', () => resolve());
      })),
    getCNs(allGroups),
  );

  return (Promise
    .all(R.flatten(Object.values(groupsWithMembersBeingLoaded)))
    .then(() => Promise.resolve(groups)));
};

const getGroupsUniqueMembers = (err, ldapRes) => {
  let groupsWithUniqueMembers = {};

  return new Promise((resolve) => {
    ldapRes
      .on('searchEntry', (entry) => {
        groupsWithUniqueMembers = entry.object.cn
          .split('&')
          .reduce(
            (sum, groupName) =>
              Object.assign({}, sum, {
                [groupName.replace('Members', '').trim()]: entry.object.uniqueMember,
              }),
            groupsWithUniqueMembers,
          );
      })
      .on('end', () => resolve(groupsWithUniqueMembers));
  });
};

const collectGroupsMembers = (ldap, err, ldapRes) =>
  getGroupsUniqueMembers(err, ldapRes).then(addGroupsMembersData.bind(null, ldap));

module.exports = {
  findGroupsMembersOpts,
  collectGroupsMembers,
};
