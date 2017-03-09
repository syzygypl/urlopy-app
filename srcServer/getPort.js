const fs = require('fs');

const { compose } = require('../common');

module.exports = compose(
  port => port[0],
  splitted => splitted.slice(-1),
  proxy => proxy.split(':'),
  parsed => parsed.proxy,
  JSON.parse,
  file => file.toString(),
  fs.readFileSync
);
