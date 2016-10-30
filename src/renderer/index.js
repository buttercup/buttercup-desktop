import 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import rpc from './system/rpc';
import configureStore from './redux/configureStore';
import * as archiveActions from './redux/modules/files';
import WorkspaceContainer from './containers/workspace';

window.__defineGetter__('rpc', () => rpc);
const store = configureStore();

rpc.on('ready', () => {
  rpc.emit('init');
});

rpc.on('new-archive', () => {
  store.dispatch(archiveActions.newArchive());
});

rpc.on('open-archive', () => {
  store.dispatch(archiveActions.openArchive());
});

render(
  <Provider store={store}>
    <WorkspaceContainer/>
  </Provider>,
  document.getElementById('root')
);
