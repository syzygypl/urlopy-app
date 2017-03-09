const devPort = require('./srcServer/getPort')('./package.json');
const { zip } = require('./common');

const config = process.env.URLOPY_APP_ENV === 'dev' ?
  [devPort] :
  [80];

const configKeysToSet = ['port'];
const zippedConfig = zip(configKeysToSet, config);

module.exports = zippedConfig;