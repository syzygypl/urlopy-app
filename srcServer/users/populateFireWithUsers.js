const R = require('ramda');
const axios = require('axios');

const db = require('../firebase').database();

module.exports = () =>
  axios.get('http://localhost:4000/users')
    .then(response =>
      db
        .ref()
        .update({
          users: response.data.reduce((prevUsers, nextUser) => {
            const withName = R.merge(nextUser, { name: nextUser.cn });

            return R.merge(
              prevUsers,
              { [nextUser.uid.replace('.', '_')]: withName },
            );
          }, {}),
        }),
    )
    .catch(error => console.log(error));
