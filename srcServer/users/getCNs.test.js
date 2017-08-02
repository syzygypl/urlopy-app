const getCNs = require('./getCNs');

describe('getCNs', () => {
  it('should get cns from arrays of attributes of a given objects', () => {
    expect(
      getCNs({
        CS: ['cn=adam nowak,ou=people,ou=client service,o=arsthanea,dc=arsthanea,dc=com'],
        IT: ['cn=adam nowak,ou=people,ou=it,o=arsthanea,dc=arsthanea,dc=com'],
        Studio: ['cn=adam nowak,ou=people,ou=design,o=arsthanea,dc=arsthanea,dc=com'],
        PM: ['cn=adam nowak,ou=people,ou=client service,o=arsthanea,dc=arsthanea,dc=com'],
        Strategy: ['cn=adam nowak,ou=people,ou=strategycreation,o=arsthanea,dc=arsthanea,dc=com'],
        Creative: ['cn=adam nowak,ou=people,ou=StrategyCreation,o=ArsThanea,dc=arsthanea,dc=com'],
      }),
    ).toEqual({
      CS: '(cn=Adam Nowak)',
      Creative: '(cn=Adam Nowak)',
      IT: '(cn=Adam Nowak)',
      PM: '(cn=Adam Nowak)',
      Strategy: '(cn=Adam Nowak)',
      Studio: '(cn=Adam Nowak)',
    });
  });
});
