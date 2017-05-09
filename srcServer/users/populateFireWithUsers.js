const axios = require('axios');

const firebase = require('../firebase');

const db = firebase.database();

module.exports = () =>
  axios.get('http://localhost:4000/users')
    .then(response =>
      db
        .ref()
        .update({
          users: response.data.reduce((a, b) =>
            Object.assign({}, a, { [b.cn.replace(' ', '_')]: b }), {}),
        }),
    )
    .catch(error => console.log(error));
