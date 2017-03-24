import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Menu from './app/Menu';
import VacationsRequests from './vacations-requests/';
import VacationsRequestDetails from './vacations-requests/Vacations/VacationsRequestDetails';

import LogInPage from './log-in-page';

import './index.css';

import store from './app/redux/store';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router>
        <div>
          <Menu />

          <hr />

          <Route exact path="/" component={() => (<div>home</div>)} />

          <Route path="/login" component={LogInPage} />

          <Route exact path="/vacationsRequests/" component={() => (<VacationsRequests />)} />
          <Route path="/vacationsRequests/:userID/:vacationsRequestID" component={VacationsRequestDetails} />

        </div>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
