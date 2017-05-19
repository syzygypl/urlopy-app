import axios from 'axios';

import { proxyAddress } from '../../../config';

const isMember = (data, memberUID, groupName) => data[groupName][memberUID];

const tryToAssignToGroup = (isUserMemberOf, groupsNamesMemberBelongsTo, groupName) => (
  isUserMemberOf(groupName)
    ? groupsNamesMemberBelongsTo.concat(groupName)
    : groupsNamesMemberBelongsTo
);

const getUserGroups = (data, isMemberFn) =>
  Object
    .keys(data)
    .reduce(tryToAssignToGroup.bind(null, isMemberFn), []);

export default memberUID =>
  axios
    .get(`${proxyAddress}/groups-members`)
    .then(({ data }) => getUserGroups(
      data,
      isMember.bind(null, data, memberUID),
    ))
    .then(groups => console.log(groups));
