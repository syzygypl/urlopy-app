import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import VacationsRequestsTable from './VacationsRequestsTable';

import * as props from './props';

const VacationsRequests = ({ firebase, vacationsRequests, currentUserID }) => {
  const addVacationsRequest = () => firebase.push(`/vacationsRequests/${currentUserID}`, {
    vacationerID: currentUserID,
    status: 'accepted',
  });

  const addUsers = () => Promise.all([
    firebase.set('/users/sancho', { name: 'Sancho Panza', mail: 'sancho@panza.pl' }),
    firebase.set('/users/baltazar', { name: 'Baltazar Gąbka', mail: 'baltazar@gabka.pl' }),
    firebase.set('/users/sandman', { name: 'Sandman', mail: 'mr@sandman.pl' }),
  ]);

  const vacationsRequestsList = (
    <ul>
      { Object
        .keys(vacationsRequests)
        .map(vacationRequestID => (
          <li
            key={vacationRequestID}
            style={{ border: '1px solid black', margin: 6, padding: 6 }}
          >
            <Link to={`/vacationsRequests/${currentUserID}/${vacationRequestID}`}>
              details
            </Link>

            {JSON.stringify(vacationsRequests[vacationRequestID])}
          </li>
        ))
      }
    </ul>
  );

  return (
    <Grid fluid>

      <Row >

        <button onClick={addVacationsRequest}>
          add vac
        </button>

        <button onClick={addUsers}>
          add users
        </button>

      </Row>

      <Row>
        <Col xs={12} md={12}>
          <div style={{ display: 'initial' }}>{vacationsRequestsList}</div>

          <VacationsRequestsTable limitToLast="100" />

        </Col>
      </Row>

    </Grid>
  );
};

VacationsRequests.defaultProps = {
  vacationsRequests: {},
};

VacationsRequests.propTypes = {
  firebase: props.firebase.isRequired,
  currentUserID: props.userID.isRequired,
  vacationsRequests: props.vacationsRequests,
};

export default compose(
  firebaseConnect(ownProps => (
    [
      `/vacationsRequests/${ownProps.currentUserID}`,
    ]
  )),
  connect(
    ({ firebase }, ownProps) => ({
      vacationsRequests: dataToJS(firebase, `vacationsRequests/${ownProps.currentUserID}`) || {},
    }),
  ),
)(VacationsRequests);
