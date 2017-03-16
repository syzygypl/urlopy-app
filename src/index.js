import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './index.css';
import store from './app/redux/store';
import MyAwesomeReactComponent from './home/MyAwesomeReactComponent';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/topics">Topics</Link></li>
          </ul>

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
