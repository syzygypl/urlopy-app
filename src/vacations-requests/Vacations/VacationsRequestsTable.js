import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import R from 'ramda';

const getInitialRows = ({ vacationsRequests, vacations, users }) => Object
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
  });

const VacationsRequestsTableShell = ({ rows, sortBy }, context) => {
  const onCellClick = ({ vrID, userID }) => context.router.history.push(`/vacationsRequests/${userID}/${vrID}`);

  return (
    <Table onCellClick={idx => onCellClick(rows[idx])}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>

          <TableHeaderColumn>
            <button onClick={() => sortBy('userName')}>sortuj</button>
            Nazwisko i imię
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('status')}>sortuj</button>
            Status
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('totalWorkDays')}>sortuj</button>
            Ilość dni urlopowych
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('startDate')}>sortuj</button>
            Początek
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('endDate')}>sortuj</button>
            Koniec
          </TableHeaderColumn>

        </TableRow>
      </TableHeader>
      <TableBody showRowHover displayRowCheckbox={false}>
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
  sortBy: PropTypes.func.isRequired,
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
      const vacationsRequests = dataToJS(firebase, 'vacationsRequests') || {};
      const vacations = dataToJS(firebase, 'vacations') || {};
      const users = dataToJS(firebase, 'users') || {};

      const rowsData = getInitialRows({ vacationsRequests, vacations, users });

      return ({
        rows: R.sortWith([R[sortRowsBy.order](R.prop(sortRowsBy.field))])(rowsData),
      });
    },
    dispatch => ({
      sortBy: key => dispatch({ type: 'SORT_ROWS_DATA', payload: key }),
    }),
  ),
)(VacationsRequestsTableShell);
