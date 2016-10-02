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
  groups: [
    {
      id: '9f08bf3c-559b-422c-91a0-4f050506678b',
      name: 'Hey',
      attributes: {},
      children: [
        {
          id: '358a2353-e0af-4d2b-9aed-f55c1584d9a4',
          name: 'Boom!',
          attributes: {},
          children: []
        }
      ]
    },
    {
      id: '2e05a350-3bb5-459c-92f0-e055a459f45a',
      name: 'Internet',
      attributes: {},
      children: []
    },
    {
      id: '73c0c2b7-d0e5-46e6-bd0d-662b60ce93ed',
      name: 'Third',
      attributes: {},
      children: []
    },
    {
      id: 'b668ace5-e0dc-49a4-92e1-ce26ac648340',
      name: 'Test',
      attributes: {},
      children: []
    }
  ]
});

render(
  <Provider store={store}>
    <Router routes={routes} history={hashHistory}/>
  </Provider>,
  document.getElementById('root')
);
