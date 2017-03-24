import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const LogInPage = ({ onSubmit }) => (
  <form onSubmit={onSubmit}>
    <Field
      style={{ margin: 6 }}
      name="username"
      hintText="nazwa użytkownika"
      component={TextField}
      underlineShow={false}
      fullWidth
      multiLine type="text"
    />

    <Field
      style={{ margin: 6 }}
      name="password"
      hintText="hasło"
      component={TextField}
      underlineShow={false}
      fullWidth
      multiLine type="text"
    />

    <button type="submit">log in</button>
  </form>
);

LogInPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'login',
})(LogInPage);
