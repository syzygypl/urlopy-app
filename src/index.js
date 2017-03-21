import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Menu from './app/Menu';
import VacationsRequests from './vacations-requests/';
import VacationsRequestDetails from './vacations-requests/VacationsRequestDetails';

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
          <Route path="/about" component={() => (<div>About</div>)} />
          <Route path="/topics" component={() => (<div>Topics</div>)} />

          <Route exact path="/vacationsRequests/" component={() => (<VacationsRequests currentUserID="1" />)} />
          <Route path="/vacationsRequests/:currentUserID/:ID" component={VacationsRequestDetails} />

        </div>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
