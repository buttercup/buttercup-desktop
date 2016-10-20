import 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import WorkspaceContainer from './containers/workspace';

const store = configureStore();

render(
  <Provider store={store}>
    <WorkspaceContainer/>
  </Provider>,
  document.getElementById('root')
);
