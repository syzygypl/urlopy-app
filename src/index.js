import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import Menu from './app/Menu';
import VacationsRequests from './vacations-requests/';
import VacationsRequestDetails from './vacations-requests/Vacations/VacationsRequestDetails';

import LogInPage from './log-in-page';

import './index.css';

import store, { history } from './app/redux/store';

import SubmitVacation from './submit-vacation/SubmitVacation';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <ConnectedRouter history={history}>
        <div>
          <Menu />

          <div className="page-content">
            <Route exact path="/" component={() => (<div>home</div>)} />

            <Route path="/login" component={LogInPage} />

            <Route exact path="/vacationsRequests/" component={() => (<VacationsRequests />)} />
            <Route path="/vacationsRequests/:userID/:vacationsRequestID" component={VacationsRequestDetails} />
            <Route path="/vacations/submit" component={SubmitVacation} />
          </div>

        </div>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
