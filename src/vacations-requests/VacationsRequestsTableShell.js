import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

const VacationsRequestsTableShell = ({ children }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>Nazwisko i imię</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Ilość dni urlopowych</TableHeaderColumn>
        <TableHeaderColumn>Początek</TableHeaderColumn>
        <TableHeaderColumn>Koniec</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {children}
    </TableBody>
  </Table>
);

VacationsRequestsTableShell.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    startDate: PropTypes.string,
    totalWorkDays: PropTypes.number,
    userName: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
};

export default VacationsRequestsTableShell;
