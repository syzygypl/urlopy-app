import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import * as props from './props';

const VacationsRequests = ({ firebase, vacationsRequests, currentUserID }) => {
  const addVacationsRequest = () => firebase.push(`/vacationsRequests/${currentUserID}`, {
    vacationerID: currentUserID,
    status: 'accepted',
  });

  const addUsers = () => Promise.all([
    firebase.set('/users/0', { name: 'Sancho Panza', mail: 'sancho@panza.pl' }),
    firebase.set('/users/1', { name: 'Baltazar Gąbka', mail: 'baltazar@gabka.pl' }),
    firebase.set('/users/2', { name: 'Sandman', mail: 'mr@sandman.pl' }),
  ]);

  return (
    <Grid fluid>

      <Row style={{ display: 'none' }}>

        <button onClick={addVacationsRequest}>
          add vac
        </button>

        <button onClick={addUsers}>
          add users
        </button>

      </Row>

      <Row>
        <Col xs={12} md={12}>

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
