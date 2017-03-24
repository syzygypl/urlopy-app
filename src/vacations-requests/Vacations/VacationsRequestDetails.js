import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import Comments from '../Comments/Comments';
import Vacations from './Vacations';
import VacationsRequestsStatus from './VacationsRequestsStatus';

import * as props from '../props';

const doAfterPrompt = (callback, ...args) => {
  const prompt = 'Czy podjąć decyzję?';

  if (confirm(prompt)) {
    callback(...args);
  }
};

const VacationsRequestDetails = ({ match, firebase, vacationsRequest }) => {
  const forVacationsRequest = (userID, vrID) => `/vacationsRequests/${userID}/${vrID}`;

  const decide = (status, userID, vrID) => {
    const link = forVacationsRequest(userID, vrID);

    return firebase.set(link, Object.assign({}, vacationsRequest, { status }));
  };

  const decideAfterPrompt = doAfterPrompt.bind(null, decide);

  return (
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
};

VacationsRequestDetails.propTypes = {
  match: props.match.isRequired,
  firebase: props.firebase.isRequired,
  vacationsRequest: props.vacationsRequest.isRequired,
};

export default compose(
  firebaseConnect(({ match }) => (
    [
      `/vacationsRequests/${match.params.userID}/${match.params.vacationsRequestID}`,
    ]
  )),
  connect(
    ({ firebase }, { match }) => ({
      vacationsRequest: dataToJS(firebase, `vacationsRequests/${match.params.userID}/${match.params.vacationsRequestID}`) || {},
    }),
  ),
)(VacationsRequestDetails);
