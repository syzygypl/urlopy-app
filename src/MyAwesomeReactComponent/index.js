import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import {
  firebaseConnect,
  dataToJS,
} from 'react-redux-firebase';

const MyAwesomeReactComponent = ({ todos }) => (
  <div>
    <RaisedButton label="Default" />
    {todos}
  </div>
);

MyAwesomeReactComponent.defaultProps = {
  todos: '',
};

MyAwesomeReactComponent.propTypes = {
  todos: PropTypes.string,
};

export default compose(
  firebaseConnect([
    '/todos',
  ]),
  connect(
    ({ firebase }) => ({
      todos: dataToJS(firebase, 'todos'),
    }),
  ),
)(MyAwesomeReactComponent);
