import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import R from 'ramda';

import statuses from '../../app/helpers/statuses';

import Column from './Column';

const getInitialRows = ({ vacationsRequests, vacations, users }) => {
  const toLoad = [vacationsRequests, vacations, users];
  const isDataLoaded = toLoad.filter(R.identity).filter(isLoaded).length === toLoad.length;

  return !isDataLoaded
    ? []
    : Object
      .keys(vacations)
      .map((vrID) => {
        const vacationsPerRequest = vacations[vrID];

        const vacReqData = Object
          .values(vacationsRequests)
          .filter(R.identity)
          .map(vr => vr[vrID])
          .filter(R.identity)[0];

        const user = users[vacReqData.vacationerID];
        const vacationsIDs = Object.keys(vacationsPerRequest);

        const vacationsList = vacationsIDs.map(vacationID => vacationsPerRequest[vacationID]);

        return {
          key: user.mail + vrID,
          userID: vacReqData.vacationerID,
          vrID,
          userName: user.name,
          status: statuses[vacReqData.status],
          endDate: vacationsList.map(R.prop('to')).reduce(R.max),
          startDate: vacationsList.map(R.prop('from')).reduce(R.min),
          totalWorkDays: vacationsList.map(R.prop('workDays')).reduce(R.add, 0),
        };
      });
};

const VacationsRequestsTableShell = ({ rows }, context) => {
  const onCellClick = ({ vrID, userID }) => context.router.history.push(`/vacationsRequests/${userID}/${vrID}`);

  return (
    <Table onCellClick={idx => onCellClick(rows[idx])}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          {
            [
              ['userName', 'Nazwisko i imię'],
              ['status', 'status'],
              ['totalWorkDays', 'Ilość dni urlopu'],
              ['startDate', 'początek urlopu'],
            ].map(columnTuple => (
              <TableHeaderColumn key={columnTuple[0]}>
                <Column field={columnTuple[0]}>
                  {columnTuple[1]}
                </Column>
              </TableHeaderColumn>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody showRowHover displayRowCheckbox={false}>
        {
          rows.map(({ key, userName, status, totalWorkDays, startDate }) => {
            const startDateObj = new Date(startDate);

            return (
              <TableRow key={key}>
                <TableRowColumn>{userName}</TableRowColumn>
                <TableRowColumn>{status}</TableRowColumn>
                <TableRowColumn>{totalWorkDays}</TableRowColumn>
                <TableRowColumn>{startDate}</TableRowColumn>
              </TableRow>
            );
          })
        }
      </TableBody>
    </Table>
  );
};

VacationsRequestsTableShell.contextTypes = { router: PropTypes.object };

VacationsRequestsTableShell.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    endDate: PropTypes.number,
    startDate: PropTypes.number,
    totalWorkDays: PropTypes.number,
    userName: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
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
    ({ sortRowsBy, firebase }) => {
      const vacationsRequests = dataToJS(firebase, 'vacationsRequests');
      const vacations = dataToJS(firebase, 'vacations');
      const users = dataToJS(firebase, 'users');

      const rowsData = getInitialRows({ vacationsRequests, vacations, users });

      return ({
        rows: R.sortWith([R[sortRowsBy.order](R.prop(sortRowsBy.field))])(rowsData),
      });
    },
  ),
)(VacationsRequestsTableShell);
