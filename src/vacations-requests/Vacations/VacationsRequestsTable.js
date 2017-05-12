import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import R from 'ramda';

import isDataLoaded from '../../app/helpers/isDataLoaded';
import statuses from '../../app/helpers/statuses';

import Column from './Column';

const getUser = (vacReqData, users, vrID, vacationsPerRequest) => {
  const possibleUser = vacReqData ? users[vacReqData.vacationerID] : null;

  const vacationsIDs = Object.keys(vacationsPerRequest);

  const vacationsList = vacationsIDs.map(vacationID => vacationsPerRequest[vacationID]);

  return (possibleUser ? mapUser(possibleUser) : {});

  function mapUser(user) {
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
  }
};

const getInitialRows = (data) => {
  const { vacationsRequests, vacations, users } = data;

  return (R.any(R.isNil, [vacationsRequests, vacations, users]))
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

        return getUser(vacReqData, users, vrID, vacationsPerRequest);
      })
      .filter(a => !R.isNil(a));
};

const VacationsRequestsTableShell = ({ rows }, context) => {
  const notEmptyRows = rows.filter(row => !R.isEmpty(row));

  const onCellClick = ({ vrID, userID }) => context.router.history.push(`/vacationsRequests/${userID}/${vrID}`);

  return (
    <Table onCellClick={idx => onCellClick(notEmptyRows[idx])}>
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
          notEmptyRows.map(({ key, userName, status, totalWorkDays, startDate }) =>
            (
              <TableRow key={key}>
                <TableRowColumn>{userName}</TableRowColumn>
                <TableRowColumn>{status}</TableRowColumn>
                <TableRowColumn>{totalWorkDays}</TableRowColumn>
                <TableRowColumn>{startDate}</TableRowColumn>
              </TableRow>
            ),
          )
        }
      </TableBody>
    </Table>
  );
};

VacationsRequestsTableShell.contextTypes = { router: PropTypes.object };

VacationsRequestsTableShell.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
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

      const rowsData = isDataLoaded([vacationsRequests, vacations, users])
        ? getInitialRows({
          vacationsRequests: R.dissoc('undefined', vacationsRequests),
          vacations,
          users,
        })
        : [];

      return ({
        rows: R.sortWith([R[sortRowsBy.order](R.prop(sortRowsBy.field))])(rowsData),
      });
    },
  ),
)(VacationsRequestsTableShell);
