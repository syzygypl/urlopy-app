const scss = require('postcss-scss');
const preCSS = require('precss');

module.exports = {
  syntax: scss,
  plugins: [preCSS]
};
