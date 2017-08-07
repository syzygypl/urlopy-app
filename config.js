// proxy comes from package.json as it is needed there for create-react-app proxying
// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development

const { proxy } = require('./package.json');
const devPort = require('./srcServer/getPort')(proxy);

const config = {
  port: 80,
  proxyAddress: proxy,
};

const devConfigOverrides = {
  port: devPort,
};

module.exports = process.env.URLOPY_APP_ENV === 'dev' ? Object.assign({}, config, devConfigOverrides) : config;
