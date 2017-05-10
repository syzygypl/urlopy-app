import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import Paper from 'material-ui/Paper';

import Vacation from './Vacation';
import * as props from '../props';

const Vacations = ({ vacations }) => (
  <Grid fluid>

    <Row>
      <Col xs={12} md={12}>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {
            Object
              .keys(vacations)
              .map(vacationID => (

                <li key={vacationID}>
                  <Paper
                    style={{
                      margin: 20,
                      padding: 10,
                    }}
                    zDepth={1}
                  >

                    <Vacation vacation={vacations[vacationID]} />

                  </Paper>
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
