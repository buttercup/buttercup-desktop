import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import configureStore from './redux/configureStore';

const store = configureStore({
  recentFiles: []
});

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory}/>
  </Provider>,
  document.getElementById('root')
);
