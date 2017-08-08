import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import RestrictedArea from './restrictedArea';

import Menu from './app/Menu';
import Routes from './routes';
import LogInPage from './log-in-page';

import './index.css';

import store, { history } from './app/redux/store';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <ConnectedRouter history={history}>
        <div>
          <Route path="/login" component={LogInPage} />
          <RestrictedArea redirect="/login">
            <div className="page-wrapper">
              <Menu />
              <Routes />
            </div>
          </RestrictedArea>
        </div>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
