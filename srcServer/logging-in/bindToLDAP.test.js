const bindToLDAP = require('./bindToLDAP');

describe('bindToLDAP', () => {
  describe('when an error occured', () => {
    const ldapClient = {
      bind: (client, dn, cb) => {
        cb('some error');
      },
    };

    it('should have error message', async () => {
      try {
        await bindToLDAP(ldapClient, 'dn', 'password');
      } catch (e) {
        expect(e.err).toBe('some error');
      }
    });

    it('should return client', async () => {
      try {
        await bindToLDAP(ldapClient, 'dn', 'password');
      } catch (e) {
        expect(e.client).toBe(ldapClient);
      }
    });
  });

  describe('when no error occured', () => {
    const ldapClient = {
      bind: (client, dn, cb) => {
        cb();
      },
    };

    it('should have no error message', async () => {
      const res = await bindToLDAP(ldapClient, 'dn', 'password');

      expect(res.err).toBe(null);
    });

    it('should return client', async () => {
      const res = await bindToLDAP(ldapClient, 'dn', 'password');

      expect(res.client).toBe(ldapClient);
    });
  });
});
