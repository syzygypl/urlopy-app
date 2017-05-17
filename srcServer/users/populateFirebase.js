const axios = require('axios');

const config = require('./../../config');

const db = require('../firebase').database();

module.exports = field =>
  axios.get(`${config.proxyAddress}/${field}`)
    .then(response =>
      db
        .ref()
        .update({ [field]: response.data }))
    .catch(error => console.log(error));
