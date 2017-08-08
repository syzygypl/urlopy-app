import axios from 'axios';
import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { firebase as withFirebase, pathToJS } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import { startLogin, loginError, loginSuccess } from './authReducer';
import RestrictedArea from '../restrictedArea';

import LogInForm from './LogInForm';

const LogInPage = ({ fireAuth, firebase, username, password, logIn, auth, history }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();
    const redirectURL = auth.redirectURL;
    logIn(username, password, firebase)
      .then(() => {
        history.replace(redirectURL);
      });
  };

  return (
    <RestrictedArea loggedOff redirect="/">
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
    </RestrictedArea>
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
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default compose(
  withFirebase(),
  withRouter,
  connect(
    state => ({
      fireAuth: pathToJS(state.firebase, 'auth'),
      auth: state.auth,
      username: formValueSelector('login')(state, 'username'),
      password: formValueSelector('login')(state, 'password'),
    }),
    dispatch => ({
      logIn(username, password, firebase) {
        dispatch(startLogin());

        return axios
          .post('/login', { username, password })
          .then(res => firebase.auth().signInWithCustomToken(res.data))
          .then(() => dispatch(loginSuccess()))
          .catch(() => dispatch(loginError()));
      },
    })),
)(LogInPage);
