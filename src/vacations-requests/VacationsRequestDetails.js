import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import Comments from './Comments';
import Vacations from './Vacations';
import VacationsRequestsStatus from './VacationsRequestsStatus';

import * as props from './props';

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
        <Col xs={5}>

          <VacationsRequestsStatus
            vacationsRequest={vacationsRequest}
            vacationsRequestID={match.params.ID}
            currentUserID={match.params.currentUserID}
            doAfterPrompt={decideAfterPrompt}
          />

        </Col>

      </Row>
      <Row>
        <Col xs={6}>
          <Vacations vacationsRequestsID={match.params.ID} />
        </Col>

        <Col xs={6}>
          <Comments
            currentUserID={match.params.currentUserID}
            vacationsRequestsID={match.params.ID}
          />
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
      `/vacationsRequests/${match.params.currentUserID}/${match.params.ID}`,
    ]
  )),
  connect(
    ({ firebase }, { match }) => ({
      vacationsRequest: dataToJS(firebase, `vacationsRequests/${match.params.currentUserID}/${match.params.ID}`) || {},
    }),
  ),
)(VacationsRequestDetails);
