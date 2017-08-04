import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ConnectedRouter } from 'react-router-redux';

import Menu from './app/Menu';
import Routes from './routes';

import './index.css';

import store, { history } from './app/redux/store';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <ConnectedRouter history={history}>
        <div>
          <Menu />

          <Routes />

        </div>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
