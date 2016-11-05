import 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import rpc from './system/rpc';
import { getWorkspace } from './system/buttercup/archive';
import { copyToClipboard, setWindowSize } from './system/utils';
import configureStore from './redux/configureStore';
import * as archiveActions from './redux/modules/files';
import * as entryActions from './redux/modules/entries';
import WorkspaceContainer from './containers/workspace';

window.__defineGetter__('rpc', () => rpc);
const store = configureStore();

setWindowSize(870, 550);

rpc.on('ready', () => {
  rpc.emit('init');
});

rpc.on('new-archive', () => {
  store.dispatch(archiveActions.newArchive());
});

rpc.on('open-archive', () => {
  store.dispatch(archiveActions.openArchive());
});

rpc.on('is-in-workspace', () => {
  rpc.emit('in-workspace', getWorkspace() !== null);
});

rpc.on('copy-current-password', () => {
  const currentEntry = entryActions.getCurrentEntry(store.getState().entries);
  if (currentEntry) {
    copyToClipboard(currentEntry.properties.password || '');
  }
});

render(
  <Provider store={store}>
    <WorkspaceContainer/>
  </Provider>,
  document.getElementById('root')
);
