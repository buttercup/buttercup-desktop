import Buttercup from 'buttercup-web';
import React from 'react';
import { ipcRenderer as ipc } from 'electron';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from '../shared/store/configure-store';
import { getSharedArchiveManager } from '../shared/buttercup/archive';
import { linkArchiveManagerToStore } from '../shared/buttercup/store';
import { addArchiveFromSource, loadOrUnlockArchive, setCurrentArchive } from '../shared/actions/archives';
import * as groupActions from '../shared/actions/groups';
import { setWindowSize } from '../shared/actions/settings';
import { importHistoryFromRequest, showHistoryPasswordPrompt } from '../shared/buttercup/import';
import { setupShortcuts } from './system/shortcuts';
import Root from './containers/root';

// Unhandled rejections
// const unhandled = require('electron-unhandled');
// unhandled();

// Make crypto faster!
Buttercup.Web.HashingTools.patchCorePBKDF();
const store = configureStore({}, 'renderer');

// temp
global.archiveManager = getSharedArchiveManager();

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

window.test = () => {
  store.dispatch(addArchiveFromSource({
    type: 'ipc',
    path: '/Users/sallar/Desktop/sallar.bcup',
    isNew: false
  }));
};

ipc.on('size-change', size => {
  store.dispatch(setWindowSize(size));
});

ipc.on('import-history', (e, request) => {
  importHistoryFromRequest(request);
  store.dispatch(groupActions.reloadGroups());
});

ipc.on('import-history-prompt', () => {
  showHistoryPasswordPrompt()
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
