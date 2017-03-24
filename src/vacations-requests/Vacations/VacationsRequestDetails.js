import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import Comments from '../Comments/Comments';
import Vacations from './Vacations';
import VacationsRequestsStatus from './VacationsRequestsStatus';

import * as props from '../props';

import doAfterPrompt from '../../app/helpers/doAfterPrompt';

const VacationsRequestDetails = ({ match, decideAfterPrompt, vacationsRequest }) => (
  <Grid style={{ margin: 6, padding: 6 }} fluid>
    <Row>

      <Col xs={6}>

        <VacationsRequestsStatus
          vacationsRequest={vacationsRequest}
          vacationsRequestID={match.params.vacationsRequestID}
          currentUserID={match.params.userID}
          doAfterPrompt={decideAfterPrompt}
        />

        <Vacations vacationsRequestsID={match.params.vacationsRequestID} />

      </Col>

      <Col xs={6}>

        <Comments vacationsRequestsID={match.params.vacationsRequestID} />

      </Col>

    </Row>

  </Grid>
);

VacationsRequestDetails.propTypes = {
  match: props.match.isRequired,
  vacationsRequest: props.vacationsRequest.isRequired,
  decideAfterPrompt: PropTypes.func.isRequired,
};

export default compose(
  firebaseConnect(({ match }) => (
    [
      `/vacationsRequests/${match.params.userID}/${match.params.vacationsRequestID}`,
    ]
  )),
  connect(
    ({ firebase }, ownProps) => {
      const forVacationsRequest = (userID, vrID) => `/vacationsRequests/${userID}/${vrID}`;

      const decide = (vacationsRequest, status, userID, vrID) => {
        const link = forVacationsRequest(userID, vrID);

        return ownProps.firebase.set(link, Object.assign({}, vacationsRequest, { status }));
      };

      const decideAfterPrompt = doAfterPrompt.bind(null, decide);

      return {
        decideAfterPrompt,
        vacationsRequest: dataToJS(
          firebase,
          `vacationsRequests/${ownProps.match.params.userID}/${ownProps.match.params.vacationsRequestID}`,
        ) || {},
      };
    },
  ),
)(VacationsRequestDetails);
