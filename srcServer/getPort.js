const { compose } = require('redux');

module.exports = compose(
  port => port[0],
  splitted => splitted.slice(-1),
  proxy => proxy.split(':'),
);
