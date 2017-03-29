import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebase as withFirebase, pathToJS } from 'react-redux-firebase';

import LogInForm from './LogInForm';

const LogInPage = ({ fireAuth, firebase, username, password, logIn, auth }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();

    logIn(username, password, firebase);
  };

  return (
    <Grid fluid>
      <Row center="xs">

        <Col>
          <Row center="xs">
            {
              fireAuth
                ? <RaisedButton label="Wyloguj" onClick={() => firebase.logout()} />
                : <LogInForm onSubmit={onSubmit} info={auth.info} />
            }
          </Row>
        </Col>

      </Row>


    </Grid>
  );
};

LogInPage.defaultProps = {
  username: '',
  password: '',
  fireAuth: null,
};

LogInPage.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  logIn: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    auth: PropTypes.func.isRequired,
  }).isRequired,
  fireAuth: PropTypes.shape({}),
};

export default compose(
  withFirebase(),
  connect(
    state => ({
      fireAuth: pathToJS(state.firebase, 'auth'),
      auth: state.auth,
      username: formValueSelector('login')(state, 'username'),
      password: formValueSelector('login')(state, 'password'),
    }),
    dispatch => ({
      logIn(username, password, firebase) {
        dispatch({ type: 'LOGGING_IN' });

        return axios
          .post('/login', { username, password })
          .then(res => firebase.auth().signInWithCustomToken(res.data))
          .then(() => dispatch({ type: 'LOGGING_IN_SUCCESS' }))
          .catch(() => dispatch({ type: 'LOGGING_IN_ERROR' }));
      },
    })),
)(LogInPage);
