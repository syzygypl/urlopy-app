const scss = require('postcss-scss');
const stylelint = require('stylelint');
const preCSS = require('precss');

module.exports = {
  syntax: scss,
  plugins: [preCSS, stylelint()]
};
