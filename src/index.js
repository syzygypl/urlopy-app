import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.css';

import store from './app/redux/store';

import Menu from './app/Menu';
import MyAwesomeReactComponent from './home/MyAwesomeReactComponent';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router>
        <div>
          <Menu />

          <hr />

          <Route exact path="/" component={() => <MyAwesomeReactComponent />} />
          <Route path="/about" component={() => (<div>About</div>)} />
          <Route path="/topics" component={() => (<div>Topics</div>)} />
        </div>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
