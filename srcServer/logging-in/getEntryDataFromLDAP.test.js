const getEntryDataFromLDAP = require('./getEntryDataFromLDAP');

const getLDAPClient = () => {
  const ldapClient = {

    runCallback: (eventName, data) => ldapClient.callbacks[eventName](data),

    callbacks: {},

    search: (dn, options, cb) => {
      cb({}, {

        on: (eventName, onCallback) => {
          ldapClient.callbacks[eventName] = onCallback;
        },

      });
    },

  };

  return ldapClient;
};

describe('bindToLDAP', () => {
  describe('when entry was found', () => {
    it('should resolve with data from ldap', async () => {
      const ldapClient = getLDAPClient();

      const promise = getEntryDataFromLDAP(ldapClient, {});

      ldapClient.runCallback('searchEntry', { object: { data: [] } });

      expect(await promise).toEqual({ data: [] });
    });
  });

  describe('on search end', () => {
    it('should reject with whatever the result', async () => {
      const ldapClient = getLDAPClient();

      try {
        const promise = getEntryDataFromLDAP(ldapClient, {});

        ldapClient.runCallback('end', 'some error');

        await promise;
      } catch (err) {
        expect(err).toBe('some error');
      }
    });
  });
});
