import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid';

import axios from 'axios';

import Log from './LogInForm';

const LogInPage = ({ username, password, logIn, auth, getSomeSecretData }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();

    logIn(username, password);
  };

  return (
    <Grid fluid>
      <Row center="xs">

        <Col>
          {
            auth.isAuthenticated
              ? 'zalogowano'
              : <Row center="xs"><Log onSubmit={onSubmit} notAuthReason={auth.reason} /></Row>
          }
        </Col>

      </Row>
      <Row center="xs">
        <button onClick={() => getSomeSecretData(auth.token)}>get some secret!</button>
      </Row>

    </Grid>
  );
};

LogInPage.defaultProps = {
  username: '',
  password: '',
};

LogInPage.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
  }).isRequired,
  getSomeSecretData: PropTypes.func.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  logIn: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    auth: state.auth,
    username: formValueSelector('login')(state, 'username'),
    password: formValueSelector('login')(state, 'password'),
  }),
  dispatch => ({
    getSomeSecretData(token) {
      return axios
        .post('/someSecretIsKeptHere', { token })
        .then(res => alert(res.data))
        .catch(res => alert(res));
    },

    logIn(username, password) {
      dispatch({ type: 'LOGGING_IN' });

      return axios
        .post('/login', {
          username,
          password,
        })
        .then(res => dispatch({ type: 'LOGGING_IN_SUCCESS', payload: res.data }))
        .catch(() => dispatch({ type: 'LOGGING_IN_ERROR' }));
    },
  }),
)(LogInPage);
