const dnToCapitalizedFullName = require('./dnToCapitalizedFullName');

describe('dnToCapitalizedFullName', () => {
  describe('when given DN', () => {
    it('should return capitalized full name', () => {
      expect(dnToCapitalizedFullName('cn=jan nowak,ou=people,ou=it,o=arsthanea,dc=arsthanea,dc=com')).toBe('Jan Nowak');
    });
  });

  describe('when given only cn part of DN', () => {
    it('should return capitalized full name', () => {
      expect(dnToCapitalizedFullName('cn=jan nowak')).toBe('Jan Nowak');
    });
  });

  describe('when there is no comma in the given string', () => {
    it('should capitalize all space-separated words', () => {
      expect(dnToCapitalizedFullName('a b c')).toBe('A B C');
      expect(dnToCapitalizedFullName('ou=people')).toBe('Ou=people');
      expect(dnToCapitalizedFullName('jan nowak')).toBe('Jan Nowak');
    });
  });
});
