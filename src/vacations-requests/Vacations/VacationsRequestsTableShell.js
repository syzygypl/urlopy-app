import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

import R from 'ramda';

const VacationsRequestsTableShell = ({ rows, sortBy }, context) => {
  const onCellClick = ({ vrID, userID }) => context.router.history.push(`/vacationsRequests/${userID}/${vrID}`);

  return (
    <Table onCellClick={idx => onCellClick(rows[idx])}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>

          <TableHeaderColumn>
            <button onClick={() => sortBy('userName', rows)}>sortuj</button>
            Nazwisko i imię
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('status', rows)}>sortuj</button>
            Status
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('totalWorkDays', rows)}>sortuj</button>
            Ilość dni urlopowych
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('startDate', rows)}>sortuj</button>
            Początek
          </TableHeaderColumn>

          <TableHeaderColumn>
            <button onClick={() => sortBy('endDate', rows)}>sortuj</button>
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

export default connect(
  ({ rows }, ownProps) => ({
    rows: R.isEmpty(rows) ? ownProps.initialRows : rows,
  })
  ,
  dispatch => ({
    sortBy: (key, rows) => {
      const sorter = R.sortWith([R.ascend(R.prop(key))]);

      dispatch({ type: 'SORT_ROWS_DATA', payload: sorter(rows) });
    },
  }),
)(VacationsRequestsTableShell);
