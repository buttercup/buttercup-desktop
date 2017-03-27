import Buttercup from 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { getInitialStateRenderer } from 'electron-redux';
import configureStore from '../shared/store/configure-store';
import * as archiveActions from '../shared/actions/files';
import * as groupActions from '../shared/actions/groups';
import * as uiActions from '../shared/actions/ui';
import { getCurrentEntry } from '../shared/selectors';
import rpc from './system/rpc';
import { getWorkspace } from './system/buttercup/archive';
import { importHistoryFromRequest, showHistoryPasswordPrompt } from './system/buttercup/import';
import { copyToClipboard, setWindowSize } from './system/utils';
import Root from './containers/root';

// Make crypto faster!
Buttercup.Web.HashingTools.patchCorePBKDF();

window.__defineGetter__('rpc', () => rpc);
setWindowSize(870, 550);

const initialState = getInitialStateRenderer();
const store = configureStore(initialState, 'renderer');

rpc.on('ready', () => {
  rpc.emit('init');
  // sallar();
});

rpc.on('open-file', path => {
  store.dispatch(archiveActions.openFile(path));
});

rpc.on('new-file', path => {
  store.dispatch(archiveActions.createNewFile(path));
});

rpc.on('is-in-workspace', () => {
  rpc.emit('in-workspace', getWorkspace() !== null);
});

rpc.on('copy-current-password', () => {
  const selection = window.getSelection().toString();
  const currentEntry = getCurrentEntry(store.getState());

  if (selection !== '') {
    copyToClipboard(selection);
  } else if (currentEntry) {
    copyToClipboard(currentEntry.properties.password);
  }
});

rpc.on('size-change', size => {
  store.dispatch(uiActions.setWindowSize(size));
});

rpc.on('import-history', request => {
  importHistoryFromRequest(request);
  store.dispatch(groupActions.reloadGroups());
});

rpc.on('import-history-prompt', () => {
  showHistoryPasswordPrompt()
    .then(result => {
      rpc.emit('import-history-prompt-resp', result);
    }).catch(() => {
      rpc.emit('import-history-prompt-resp', null);
    });
});

render(
  <AppContainer>
    <Root store={store} history={history}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NewRoot = require('./containers/root').default;

    render(
      <AppContainer>
        <NewRoot store={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

window.sallar = () => {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('show-file-manager');
};
