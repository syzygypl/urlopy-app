// @flow
import React, { PropTypes } from 'react';

import DateRangePicker from './index';


const DateRangePickerField = ({
  input: { value, onChange },
  meta: { touched, error, warning },
  ...rest
}) => (
  <DateRangePicker
    value={value}
    onChange={onChange}
    touched={touched}
    error={error}
    warning={warning}
    {...rest}
  />
);


DateRangePickerField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
};

export default DateRangePickerField;
