const fs = require('fs');
const { compose } = require('redux');

module.exports = compose(
  parsed => parsed.proxy,
  JSON.parse,
  file => file.toString(),
  fs.readFileSync,
);
