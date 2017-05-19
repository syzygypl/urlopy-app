module.exports = DN => (
  DN.replace('cn=', '')
    .split(',')[0]
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('\ ')
);
