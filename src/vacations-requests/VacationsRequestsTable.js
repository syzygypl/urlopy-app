import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import { TableRow, TableRowColumn } from 'material-ui/Table';

import R from 'ramda';
import { users as usersProp, vacations as vacationsProp, vacationsRequests as vacationsRequestsProp } from './props';

import VacationsRequestsTableShell from './VacationsRequestsTableShell';

const VacationsRequestsTable = ({ vacationsRequests, users, vacations }) => {
  const rows = Object
    .keys(vacations)
    .map((vrID) => {
      const vacationsPerRequest = vacations[vrID] || {};
      const vacReqData = Object.values(vacationsRequests).map(vr => vr[vrID])[0] || {};

      const user = users[vacReqData.vacationerID] || {};
      const vacationsIDs = Object.keys(vacationsPerRequest);

      const vacationsList = vacationsIDs.map(vacationID => vacationsPerRequest[vacationID]);

      return {
        key: user.mail + vrID,
        userName: user.name,
        status: vacReqData.status,
        endDate: vacationsList.map(R.prop('endDate')).reduce(R.max),
        startDate: vacationsList.map(R.prop('startDate')).reduce(R.min),
        totalWorkDays: vacationsList.map(R.prop('workDays')).reduce(R.add, 0),
      };
    });

  return (
    <VacationsRequestsTableShell>
      {
        rows.map(({ key, userName, status, totalWorkDays, startDate, endDate }) => (
          <TableRow key={key}>
            <TableRowColumn>{userName}</TableRowColumn>
            <TableRowColumn>{status}</TableRowColumn>
            <TableRowColumn>{totalWorkDays}</TableRowColumn>
            <TableRowColumn>{new Date(startDate).toDateString()}</TableRowColumn>
            <TableRowColumn>{new Date(endDate).toDateString()}</TableRowColumn>
          </TableRow>
        ))
      }
    </VacationsRequestsTableShell>
  );
};

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
