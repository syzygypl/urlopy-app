import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect } from 'react-redux-firebase';

import * as props from './props';

import VacationsRequestsTable from './Vacations/VacationsRequestsTable';

const VacationsRequests = ({ addVacationsRequest, firebase }) => (
  <Grid fluid>

    <Row>

      <button onClick={() => addVacationsRequest(firebase.auth().currentUser.uid)}>
        add vac
      </button>

    </Row>

    <Row>
      <Col xs={12} md={12}>
        <VacationsRequestsTable limitToLast="100" />
      </Col>
    </Row>

  </Grid>
);

VacationsRequests.defaultProps = {
  vacationsRequests: {},
};

VacationsRequests.propTypes = {
  firebase: props.firebase.isRequired,
  addVacationsRequest: PropTypes.func.isRequired,
};

export default compose(
  firebaseConnect(ownProps => (
    [
      `/vacationsRequests/${ownProps.currentUserID}`,
    ]
  )),
  connect(
    ({ currentUserID }) => ({ currentUserID }),
    ((dispatch, ownProps) =>
        ({
          addVacationsRequest(ID) {
            const addVacation = vacationsRequestID => ownProps.firebase.push(`/vacations/${vacationsRequestID}`, {
              to: Date.now(),
              from: Date.now(),
              workDays: 4,
            });

            return ownProps.firebase
              .push(`/vacationsRequests/${ID}`, {
                notifyUser: 'Adam_Nowak',
                vacationerID: ID,
                status: 'accepted',
              })
              .then(newVacationsRequest => addVacation(newVacationsRequest.getKey()));
          },
        })
    ),
  ),
)(VacationsRequests);
