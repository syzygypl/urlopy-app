const R = require('ramda');

const ldap = require('ldapjs')
  .createClient({
    url: process.env.LDAP_URL,
  });

const findUsersOpts = {
  filter: '(objectClass=person)',
  scope: 'sub',
};

const findGroupsOpts = {
  filter: '(cn=*:head)',
  scope: 'sub',
};

const getGroup = dn => (
  dn.split(',')
    .filter(dnParts => dnParts.startsWith('ou'))
    .map(ouParts => ouParts.replace('ou=', ''))
    .filter(groupType => groupType !== 'people')
    .join('')
);

const collectUsers = (err, ldapRes) => new Promise((resolve) => {
  let users = {};

  ldapRes.on('searchEntry', (entry) => {
    users = Object.assign({}, users, {
      [entry.object.uid.replace('.', '_')]: {
        name: entry.object.cn,
        uid: entry.object.uid,
        mail: entry.object.mail,
        groupID: getGroup(entry.object.dn),
        cn: entry.object.cn,
      },
    });
  });

  ldapRes.on('end', () => resolve(users));
});

const collectGroups = (err, ldapRes) => new Promise((resolve) => {
  let groups = {};

  ldapRes.on('searchEntry', (entry) => {
    const entryObj = entry.object;
    const groupHead = entryObj.uniqueMember[1];
    const groupName = entryObj.cn.split(':')[0];

    groups = Object.assign({}, groups, {
      [groupName]: groupHead,
    });
  });

  ldapRes.on('end', () => resolve(groups));
});

const searchIn = (ldapClient, ldapSearchOpts, ldapResHandler, base, req, res) => {
  ldapClient.search(
    base,
    ldapSearchOpts,
    (err, ldapRes) => ldapResHandler(err, ldapRes).then(res.send.bind(res)),
  );
};

const searchInLDAP = searchIn.bind(null, ldap);

const cnToCapitalizedName = r => (
  r.replace('cn=', '')
    .split(',')[0]
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('\ ')
);

const findGroupLeader = (data) => {
  const leadersFullNames = (
    Object
      .values(data)
      .map(cnToCapitalizedName)
      .map(fullName => `(cn=${fullName})`)
      .join('')
  );

  const leaderAndGroup = R.invertObj(data);

  return new Promise((resolve, reject) => {
    ldap.search(
      'o=ArsThanea,dc=arsthanea,dc=com',
      {
        scope: 'sub',
        filter: `(|${leadersFullNames})`,
      },
      (err, ldapRes) => {
        let groups = {};

        ldapRes.on('error', ldapErr => reject(ldapErr));

        ldapRes.on('searchEntry', (entry) => {
          const entryObj = entry.object;
          const leaderDN = entryObj.dn.toLowerCase();
          const groupName = leaderAndGroup[leaderDN];

          if (groupName) {
            groups = Object.assign({}, groups, {
              [groupName]: {
                name: groupName,
                leaderID: entryObj.uid.replace('.', '_'),
                leaderCN: entryObj.cn,
                leaderUID: entryObj.uid,
              },
            });
          }
        });

        ldapRes.on('end', () => resolve(groups));
      });
  });
};

module.exports = (
  require('express').Router()
    .get('/users', searchInLDAP.bind(null, findUsersOpts, collectUsers, 'o=ArsThanea,dc=arsthanea,dc=com'))
    .get('/groups', searchInLDAP.bind(null, findGroupsOpts, (err, ldapRes) => collectGroups(err, ldapRes).then(findGroupLeader), 'dc=arsthanea,dc=com'))
);
