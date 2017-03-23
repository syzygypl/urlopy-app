import React from 'react';

import * as props from '../props';

const Vacation = ({ vacation }) => (
  <div>
    <div>
      <p>Start: {(new Date(vacation.startDate)).toDateString()}</p>
      <p>Koniec: {(new Date(vacation.endDate)).toDateString()}</p>
      <p>Ilość dni?</p>
    </div>
  </div>
);

Vacation.defaultProps = {
  vacation: {},
};

Vacation.propTypes = {
  vacation: props.vacation.isRequired,
};

export default Vacation;
