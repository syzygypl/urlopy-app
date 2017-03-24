import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';

import Vacation from './Vacation';

import * as props from '../props';

const Vacations = ({ vacations }) => (
  <Grid fluid>

    <Row>
      <Col xs={12} md={12}>

        <ul>
          {
            Object
              .keys(vacations)
              .map(vacationID => (
                <li
                  key={vacationID}
                  style={{ border: '1px solid black', margin: 6, padding: 6 }}
                >
                  <Vacation
                    vacation={vacations[vacationID]}
                  />
                </li>
              ))
          }
        </ul>

      </Col>
    </Row>
  </Grid>
);

Vacations.defaultProps = {
  vacations: {},
};

Vacations.propTypes = {
  vacations: props.vacations,
};

export default compose(
  firebaseConnect(ownProps => (
    [
      `/vacations/${ownProps.vacationsRequestsID}`,
    ]
  )),
  connect(
    (state, ownProps) => ({
      vacations: dataToJS(state.firebase, `vacations/${ownProps.vacationsRequestsID}`) || {},
    }),
  ),
)(Vacations);
