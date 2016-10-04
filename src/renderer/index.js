import 'buttercup-web';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import configureStore from './redux/configureStore';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore({
  recentFiles: [],
  groups: {}
});

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory}/>
  </Provider>,
  document.getElementById('root')
);
