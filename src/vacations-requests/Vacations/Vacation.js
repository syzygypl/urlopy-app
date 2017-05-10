import React from 'react';

import * as props from '../props';

const Vacation = ({ vacation }) => (
  <div>
    <div>
      <p>Start: {vacation.from}</p>
      <p>Koniec: {vacation.to}</p>
      <p>Ilość dni: {vacation.workDays}</p>
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
