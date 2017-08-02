const { getGroup, entryToFireFormat, collectUsers } = require('./users.js');

const nowakInLDAPFormat = {
  dn: 'cn=Adam Nowak,ou=people,ou=Design,o=ArsThanea,dc=arsthanea,dc=com',
  cn: 'Adam Nowak',
  uid: 'adam.nowak',
  mail: 'adam.nowak@syzygy.pl',
};

const nowakInFireFormat = {
  cn: 'Adam Nowak',
  groupID: 'Design',
  mail: 'adam.nowak@syzygy.pl',
  name: 'Adam Nowak',
  uid: 'adam.nowak',
};

describe('getGroup', () => {
  it('should return ou from the given DN', () =>
    expect(
      getGroup('cn=Adam Nowak,ou=people,ou=Design,o=ArsThanea,dc=arsthanea,dc=com'),
    ).toBe('Design'),
  );
});

describe('collectUsers', () => {
  describe('for a given ldapResponse', () => {
    it('should return a promise containing users in firebase compliant format', async () => {
      const ldapResponse = {
        on: (actionName, cb) => {
          cb({ object: nowakInLDAPFormat });

          return {
            on: (actionName, cb) => cb(), // eslint-disable-line
          };
        },
      };

      expect(await collectUsers('err msg', ldapResponse)).toEqual({ adam_nowak: nowakInFireFormat });
    });
  });
});

describe('entryToFireFormat', () => {
  it('should transform LDAP format to the format used in firebase', () =>
    expect(
      entryToFireFormat({ object: nowakInLDAPFormat }),
    ).toEqual({ adam_nowak: nowakInFireFormat }),
  );
});
