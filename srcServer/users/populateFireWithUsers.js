const axios = require('axios');

const config = require('./../../config');

const db = require('../firebase').database();

module.exports = () =>
  axios.get(`${config.proxyAddress}/users`)
    .then(response =>
      db
        .ref()
        .update({ users: response.data }))
    .catch(error => console.log(error));
