
import React  from 'react';
import { Route } from 'react-router-dom';

import VacationsRequests from './vacations-requests/';
import SubmitVacation from './submit-vacation/SubmitVacation';
import VacationsRequestDetails from './vacations-requests/Vacations/VacationsRequestDetails';

class Routes extends React.Component {
  render() {
    return (
      <div className="page-content">
        <Route
          exact path="/"
          component={() => <div style={{ textAlign: 'center' }}>HOME</div>}
        />
        <Route exact path="/vacationsRequests/" component={VacationsRequests} />
        <Route path="/vacationsRequests/:userID/:vacationsRequestID" component={VacationsRequestDetails} />
        <Route path="/vacations/submit" component={SubmitVacation} />
      </div>
    );
  }
}

export default Routes;
