import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import { firebase as withFirebase, pathToJS } from 'react-redux-firebase';
import { requestLogin as requestLoginActionCreator } from './log-in-page/authReducer';

const AUTH_AWAIT = 'auth-await';

class RestrictedArea extends React.Component {

  static defaultProps = {
    fireAuth: AUTH_AWAIT,
    loggedOff: false,
    redirect: '/',
  };

  static propTypes = {
    fireAuth: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.oneOf([AUTH_AWAIT])]),
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
    children: PropTypes.node.isRequired,
    loggedOff: PropTypes.bool,
    requestLogin: PropTypes.func.isRequired,
    redirect: PropTypes.string,
  };

  componentDidMount() {
    this.checkAuth();
  }

  componentDidUpdate() {
    this.checkAuth();
  }

  checkAuth() {
    const { fireAuth, history } = this.props;
    if (history.location.pathname !== this.props.redirect && fireAuth !== AUTH_AWAIT) {
      if (!this.props.loggedOff && fireAuth === null) {
        this.props.requestLogin(history.location.pathname);
        history.replace(this.props.redirect);
      } else if (this.props.loggedOff && fireAuth !== null) {
        history.replace(this.props.redirect);
      }
    }
  }

  render() {
    const allow = this.props.loggedOff ? this.props.fireAuth === null : this.props.fireAuth;

    if (allow) {
      return this.props.children;
    }

    return null;
  }
}

export default compose(
  withFirebase(),
  withRouter,
  connect(
    state => ({
      fireAuth: pathToJS(state.firebase, 'auth'),
    }),
    dispatch => ({
      requestLogin(redirectURL) {
        dispatch(requestLoginActionCreator(redirectURL));
      },
    }),
  ),
)(RestrictedArea);
