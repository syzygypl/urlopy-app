import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { formValueSelector } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid';

import axios from 'axios';

import Log from './LogInForm';

const LogInPage = ({ username, password, logIn, auth }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();

    logIn(username, password);
  };

  return (
    <Grid fluid>
      <Row center="xs">

        <Col>
          {auth.isAuthenticated ? 'zalogowano' : <Log onSubmit={onSubmit} notAuthReason={auth.reason} />}
        </Col>

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
    logIn(username, password) {
      dispatch({ type: 'LOGGING_IN' });

      return axios
        .post('/login', {
          username,
          password,
        })
        .then(() => dispatch({ type: 'LOGGING_IN_SUCCESS' }))
        .catch(() => dispatch({ type: 'LOGGING_IN_ERROR' }));
    },
  }),
)(LogInPage);
