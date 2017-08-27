import Buttercup from 'buttercup-web';
import React from 'react';
import { ipcRenderer as ipc } from 'electron';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from '../shared/store/configure-store';
import { linkArchiveManagerToStore } from '../shared/buttercup/store';
import {
  addArchiveFromSource,
  loadOrUnlockArchive,
  setCurrentArchive,
  importHistoryIntoArchive
} from '../shared/actions/archives';
import { showHistoryPasswordPrompt } from '../shared/buttercup/import';
import { setupShortcuts } from './system/shortcuts';
import Root from './containers/root';

// Unhandled rejections
const unhandled = require('electron-unhandled');
unhandled();

// Make crypto faster!
Buttercup.Web.HashingTools.patchCorePBKDF();
const store = configureStore({}, 'renderer');

linkArchiveManagerToStore(store);
setupShortcuts(store);

// Reset current archive
store.dispatch(setCurrentArchive(null));

ipc.send('init');

ipc.on('load-archive', (e, payload) => {
  store.dispatch(addArchiveFromSource(payload));
});

ipc.on('set-current-archive', (e, payload) => {
  store.dispatch(loadOrUnlockArchive(payload));
});

ipc.on('import-history', (e, payload) => {
  store.dispatch(importHistoryIntoArchive(payload));
});

ipc.on('import-history-prompt', (e, payload) => {
  showHistoryPasswordPrompt(payload)
    .then(result => {
      ipc.send('import-history-prompt-resp', result);
    }).catch(() => {
      ipc.send('import-history-prompt-resp', null);
    });
});

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NewRoot = require('./containers/root').default;

    render(
      <AppContainer>
        <NewRoot store={store} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
