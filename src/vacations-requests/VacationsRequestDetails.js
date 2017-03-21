import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebase as withFirebase } from 'react-redux-firebase';

import Comments from './Comments';
import Vacations from './Vacations';

import * as props from './props';

const VacationsRequestDetails = ({ match }) => (
  <div>
    <Vacations vacationsRequestsID={match.params.ID} />

    <Comments currentUserID={match.params.currentUserID} vacationsRequestsID={match.params.ID} />
  </div>
);

VacationsRequestDetails.propTypes = {
  match: props.match.isRequired,
};

export default compose(
  withFirebase(),
  connect(),
)(VacationsRequestDetails);
