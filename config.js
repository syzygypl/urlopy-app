const devPort = require('./srcServer/getPort')('./package.json');
const { zip } = require('./common');

const proxyAddress = require('./srcServer/getProxyAddress')('./package.json');

const config = process.env.URLOPY_APP_ENV === 'dev' ?
  [devPort, proxyAddress] :
  [80, proxyAddress];

const configKeysToSet = ['port', 'proxyAddress'];
const zippedConfig = zip(configKeysToSet, config);

module.exports = zippedConfig;
