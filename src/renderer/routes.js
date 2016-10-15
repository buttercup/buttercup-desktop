import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Workspace from './containers/Workspace';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Workspace}/>
  </Route>
);
