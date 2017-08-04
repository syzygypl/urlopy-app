import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { firebase as withFirebase, pathToJS } from 'react-redux-firebase';

import LogInPage from './log-in-page';
import VacationsRequests from './vacations-requests/';
import SubmitVacation from './submit-vacation/SubmitVacation';
import VacationsRequestDetails from './vacations-requests/Vacations/VacationsRequestDetails';

class Routes extends React.Component {

  static defaultProps = {
    fireAuth: null,
  };

  static propTypes = {
    fireAuth: PropTypes.shape({}),
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  componentDidMount() {
    const { fireAuth, history } = this.props;

    if (!fireAuth) {
      history.push('/login');
    }
  }

  render() {
    return (

      <div className="page-content">
        <Route
          exact path="/"
          component={() => <div style={{ textAlign: 'center' }}>HOME</div>}
        />

        <Route path="/login" component={LogInPage} />

        <Route exact path="/vacationsRequests/" component={VacationsRequests} />
        <Route path="/vacationsRequests/:userID/:vacationsRequestID" component={VacationsRequestDetails} />
        <Route path="/vacations/submit" component={SubmitVacation} />
      </div>

    );
  }
}

export default compose(
  withRouter,
  withFirebase(),
  connect(
    state => ({
      fireAuth: pathToJS(state.firebase, 'auth'),
    }),
  ),
)(Routes);
