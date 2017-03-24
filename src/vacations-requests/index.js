import React, { PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect } from 'react-redux-firebase';

import VacationsRequestsTable from './Vacations/VacationsRequestsTable';

const VacationsRequests = ({ addUsers, currentUserID, addVacationsRequest }) => (
  <Grid fluid>

    <Row >

      <button onClick={() => addVacationsRequest(currentUserID)}>
        add vac
      </button>

      <button onClick={addUsers}>
        add users
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
  addUsers: PropTypes.func.isRequired,
  currentUserID: PropTypes.string.isRequired,
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
          addUsers() {
            return Promise.all([
              ownProps.firebase.set('/users/sancho', { name: 'Sancho Panza', mail: 'sancho@panza.pl' }),
              ownProps.firebase.set('/users/baltazar', { name: 'Baltazar Gąbka', mail: 'baltazar@gabka.pl' }),
              ownProps.firebase.set('/users/sandman', { name: 'Sandman', mail: 'mr@sandman.pl' }),
            ]);
          },
          addVacationsRequest(ID) {
            const addVacation = vacationsRequestID => ownProps.firebase.push(`/vacations/${vacationsRequestID}`, {
              startDate: Date.now(),
              endDate: Date.now(),
              addedDate: Date.now(),
              modifiedDate: Date.now(),
              workDays: 4,
            });

            return ownProps.firebase
              .push(`/vacationsRequests/${ID}`, {
                vacationerID: ID,
                status: 'accepted',
              })
              .then(newVacationsRequest => addVacation(newVacationsRequest.getKey()));
          },
        })
    ),
  ),
)(VacationsRequests);
