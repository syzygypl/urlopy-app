import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import R from 'ramda';
import { users as usersProp, vacations as vacationsProp, vacationsRequests as vacationsRequestsProp } from '../props';

import VacationsRequestsTableShell from './VacationsRequestsTableShell';

const VacationsRequestsTable = ({ vacationsRequests, users, vacations }) => (
  <VacationsRequestsTableShell
    initialRows={
     Object
      .keys(vacations)
      .map((vrID) => {
        const vacationsPerRequest = vacations[vrID] || {};
        const vacReqData = Object.values(vacationsRequests).map(vr => vr[vrID])[0] || {};

        const user = users[vacReqData.vacationerID] || {};
        const vacationsIDs = Object.keys(vacationsPerRequest);

        const vacationsList = vacationsIDs.map(vacationID => vacationsPerRequest[vacationID]);

        return {
          key: user.mail + vrID,
          userID: vacReqData.vacationerID,
          vrID,
          userName: user.name,
          status: vacReqData.status,
          endDate: vacationsList.map(R.prop('endDate')).reduce(R.max),
          startDate: vacationsList.map(R.prop('startDate')).reduce(R.min),
          totalWorkDays: vacationsList.map(R.prop('workDays')).reduce(R.add, 0),
        };
      })
    }
  />
);

VacationsRequestsTable.propTypes = {
  users: usersProp.isRequired,
  vacations: vacationsProp.isRequired,
  vacationsRequests: vacationsRequestsProp.isRequired,
};

export default compose(
  firebaseConnect(({ limitToLast }) => (
    [
      '/vacationsRequests',
      `/vacations#limitToLast=${limitToLast}`,
      '/users',
    ]
  )),
  connect(
    ({ firebase }) => ({
      vacationsRequests: dataToJS(firebase, 'vacationsRequests') || {},
      vacations: dataToJS(firebase, 'vacations') || {},
      users: dataToJS(firebase, 'users') || {},
    }),
  ),
)(VacationsRequestsTable);
