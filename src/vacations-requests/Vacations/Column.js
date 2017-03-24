import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

import SortingOrderIndicator from './SortingOrderIndicator';

const Column = ({ sortBy, field, children }) => (
  <div
    onClick={() => sortBy(field)}
    style={{ display: 'flex', justifyContent: 'space-between' }}
  >

    {children}
    <SortingOrderIndicator field={field} />

  </div>
);

Column.propTypes = {
  sortBy: PropTypes.func.isRequired,
  field: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(
  () => ({}),
  dispatch => ({
    sortBy: key => dispatch({ type: 'SORT_ROWS_DATA', payload: key }),
  }),
)(Column);
