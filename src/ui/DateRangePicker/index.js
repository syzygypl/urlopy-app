// @flow
import React, { PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';

import isAfter from 'date-fns/is_after';
import formatDate from 'date-fns/format';

import areIntlLocalesSupported from 'intl-locales-supported';

let DateTimeFormat;

// Use the native Intl.DateTimeFormat if available, or a polyfill if not.
if (areIntlLocalesSupported(['pl', 'pl-PL'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/pl');
  require('intl/locale-data/jsonp/pl-PL');
}

const formatErrorMessage = (error, warning) => {
  if (error) return error;
  if (warning) return warning;
  return '';
};

const DateRangePicker = ({
  onChange,
  onActionClick,
  actionLabel,
  hintTexts,
  floatingLabelTexts,
  value,
  touched,
  error,
  warning,
  ...rest
}) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
    <div style={{ flexGrow: 1, marginRight: '10px', alignSelf: 'flex-start' }}>
      <DatePicker
        hintText={hintTexts[0]}
        floatingLabelText={floatingLabelTexts[0]}
        DateTimeFormat={DateTimeFormat}
        locale="pl"
        formatDate={date => formatDate(date, 'YYYY-MM-DD')}
        onChange={(event, startValue) => {
          // if new start date is after currently selected one, reset the end date
          const newValue = isAfter(startValue, value[1])
            ? [startValue, undefined]
            : [startValue, value[1]];
          onChange(newValue);
        }}
        value={value[0]}
        errorText={!value[0] && touched && (error || warning) && formatErrorMessage(error, warning)}
        {...rest}
      />
    </div>
    <div style={{ flexGrow: 1, alignSelf: 'flex-start' }}>
      <DatePicker
        hintText={hintTexts[0]}
        floatingLabelText={floatingLabelTexts[1]}
        DateTimeFormat={DateTimeFormat}
        locale="pl"
        formatDate={date => formatDate(date, 'YYYY-MM-DD')}
        onChange={(event, endValue) => {
          onChange([value[0], endValue]);
        }}
        value={value[1]}
        minDate={value[0]}
        errorText={!value[1] && touched && (error || warning) && formatErrorMessage(error, warning)}
        {...rest}
      />
    </div>
    <div style={{ alignContent: 'flex-end', marginLeft: '5px' }}>
      <FlatButton
        label={actionLabel}
        onClick={() => onActionClick(value)}
        fullWidth
      />
    </div>
  </div>
);

DateRangePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  touched: PropTypes.bool,
  error: PropTypes.string,
  warning: PropTypes.string,
  onActionClick: PropTypes.func.isRequired,
  actionLabel: PropTypes.string.isRequired,
  hintTexts: PropTypes.arrayOf(PropTypes.string),
  floatingLabelTexts: PropTypes.arrayOf(PropTypes.string),
};

DateRangePicker.defaultProps = {
  value: [undefined, undefined],
  touched: false,
  error: undefined,
  warning: undefined,
  hintTexts: ['Data początkowa', 'Data końcowa'],
  floatingLabelTexts: ['Data początkowa', 'Data końcowa'],
};

export default DateRangePicker;
