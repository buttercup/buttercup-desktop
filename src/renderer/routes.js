import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import IntroScreen from './components/IntroScreen';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IntroScreen}/>
  </Route>
);
