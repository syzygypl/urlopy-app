import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

const VacationsRequestsTableShell = ({ rowsData }, context) => {
  const onCellClick = ({ vrID, userID }) => context.router.history.push(`/vacationsRequests/${userID}/${vrID}`);

  return (
    <Table onCellClick={idx => onCellClick(rowsData[idx])}>
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Nazwisko i imię</TableHeaderColumn>
          <TableHeaderColumn>Status</TableHeaderColumn>
          <TableHeaderColumn>Ilość dni urlopowych</TableHeaderColumn>
          <TableHeaderColumn>Początek</TableHeaderColumn>
          <TableHeaderColumn>Koniec</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody showRowHover displayRowCheckbox={false}>
        {
          rowsData.map(({ key, userName, status, totalWorkDays, startDate, endDate }) => (
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
  rowsData: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    endDate: PropTypes.number,
    startDate: PropTypes.number,
    totalWorkDays: PropTypes.number,
    userName: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
};

export default VacationsRequestsTableShell;
