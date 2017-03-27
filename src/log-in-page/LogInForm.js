import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { red500 } from 'material-ui/styles/colors';

const LogInPage = ({ onSubmit, notAuthReason }) => (
  <form onSubmit={onSubmit}>
    <Grid fluid>

      <Row center="xs">

        <Col>

          <Field
            style={{ margin: 6 }}
            name="username"
            floatingLabelText="Nazwa użytkownika"
            component={TextField}
            underlineShow={false}
            fullWidth
            type="text"
          />

        </Col>
      </Row>

      <Row center="xs">

        <Col>

          <Field
            style={{ margin: 6 }}
            name="password"
            component={TextField}
            underlineShow={false}
            fullWidth
            floatingLabelText="Hasło"
            type="password"
          />

        </Col>

      </Row>

      <Row center="xs">

        <Col>
          <RaisedButton label="zaloguj" primary type="submit" />
        </Col>

      </Row>

      <Row center="xs">
        <Col style={{ color: red500, padding: 6}}>
          { notAuthReason }
        </Col>
      </Row>

    </Grid>
  </form>
);

LogInPage.defaultProps = {
  notAuthReason: '',
};

LogInPage.propTypes = {
  notAuthReason: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'login',
})(LogInPage);
