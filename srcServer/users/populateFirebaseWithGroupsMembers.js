const R = require('ramda');
const axios = require('axios');

const config = require('./../../config');
const db = require('../firebase').database();

module.exports = () =>
  axios
    .get(`${config.proxyAddress}/groups-members`)
    .then((groups) => {
      const groupsWithMembersBeingUpdated = R.mapObjIndexed(
        (groupMembers, groupName) => db
          .ref()
          .update({ [`groups/${groupName.toUpperCase()}/members`]: groupMembers }),
        groups.data,
      );

      return Promise.all(Object.values(groupsWithMembersBeingUpdated));
    })
    .catch(error => console.log(error));
