const { zip } = require('./common');
const { proxy } = require('./package.json');
const devPort = require('./srcServer/getPort')(proxy);

const config = (
  process.env.URLOPY_APP_ENV === 'dev'
    ? [devPort, proxy]
    : [80, proxy]
);

const configKeysToSet = ['port', 'proxyAddress'];
const zippedConfig = zip(configKeysToSet, config);

module.exports = zippedConfig;
