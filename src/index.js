import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import store from './store';

import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
        </ul>

        <hr />

        <Route exact path="/" component={() => (<div>Home</div>)} />
        <Route path="/about" component={() => (<div>About</div>)} />
        <Route path="/topics" component={() => (<div>Topics</div>)} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
