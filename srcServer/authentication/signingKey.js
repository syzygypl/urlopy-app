const secureRandom = require('secure-random');

module.exports = secureRandom(256, { type: 'Buffer' });
