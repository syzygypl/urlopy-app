import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import Log from './LogInForm';

const LogInPage = ({ username, password }) => {
  const onSubmit = (evt) => {
    evt.preventDefault();

    console.log(username, password);
  };

  return (
    <Log onSubmit={onSubmit} />
  );
};

LogInPage.defaultProps = {
  username: '',
  password: '',
};

LogInPage.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
};

export default connect(
  state => ({
    username: formValueSelector('login')(state, 'username'),
    password: formValueSelector('login')(state, 'password'),
  }),
)(LogInPage);
