const getGroup = dn => (
  dn.split(',')
    .filter(dnParts => dnParts.startsWith('ou'))
    .map(ouParts => ouParts.replace('ou=', ''))
    .filter(groupType => groupType !== 'people')
    .join('')
);

const entryToFireFormat = entry => ({
  [entry.object.uid.replace('.', '_')]: {
    name: entry.object.cn,
    uid: entry.object.uid,
    mail: entry.object.mail,
    groupID: getGroup(entry.object.dn),
    cn: entry.object.cn,
  },
});

const collectUsers = (_, ldapRes) => new Promise((resolve) => {
  let users = {};

  ldapRes
    .on('searchEntry', (entry) => {
      users = Object.assign({}, users, entryToFireFormat(entry));
    })
    .on('end', () => resolve(users));
});

const findUsersOpts = {
  filter: '(objectClass=person)',
  scope: 'sub',
};

module.exports = { collectUsers, findUsersOpts, getGroup, entryToFireFormat };
