const { compose } = require('redux');

const getProxy = require('./getProxyAddress');

module.exports = compose(
  port => port[0],
  splitted => splitted.slice(-1),
  proxy => proxy.split(':'),
  getProxy,
);
