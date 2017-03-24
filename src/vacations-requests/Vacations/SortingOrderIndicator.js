import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

const SortingOrderIndicator = ({ field, sortRowsBy }) => (
  (sortRowsBy.field === field)
    ? <div>{sortRowsBy.order === 'ascend' ? '^' : 'v'}</div>
    : null
);

SortingOrderIndicator.propTypes = {
  field: PropTypes.string.isRequired,
  sortRowsBy: PropTypes.shape({
    order: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(
  ({ sortRowsBy }) => ({ sortRowsBy }),
)(SortingOrderIndicator);
