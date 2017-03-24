import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

import R from 'ramda';

const SortingOrderIndicator = ({ field, sortRowsBy }) => {
  const sameField = sortRowsBy.field === field;

  return sameField
    ? R.cond([
      [() => sortRowsBy.order === 'ascend', () => <ArrowUpward />],
      [() => sortRowsBy.order === 'descend', () => <ArrowDownward />],
    ])()
    : null;
};

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
