import Buttercup from 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from '../shared/store/configure-store';
import { getSharedArchiveManager } from '../shared/buttercup/archive';
import { linkArchiveManagerToStore } from '../shared/buttercup/store';
import { addArchiveFromSource } from '../shared/actions/archives';
import * as groupActions from '../shared/actions/groups';
import * as uiActions from '../shared/actions/ui';
import rpc from './system/rpc';
import { getWorkspace } from './system/buttercup/archive';
import { importHistoryFromRequest, showHistoryPasswordPrompt } from './system/buttercup/import';
import { setupShortcuts } from './system/shortcuts';
import Root from './containers/root';

// Unhandled rejections
// const unhandled = require('electron-unhandled');
// unhandled();

// Make crypto faster!
Buttercup.Web.HashingTools.patchCorePBKDF();

window.__defineGetter__('rpc', () => rpc);
const store = configureStore({}, 'renderer');

// temp
global.archiveManager = getSharedArchiveManager();

linkArchiveManagerToStore(store);
setupShortcuts(store);

rpc.on('ready', () => {
  rpc.emit('init');
});

rpc.on('load-archive', payload => {
  store.dispatch(addArchiveFromSource(payload));
});

window.test = () => {
  store.dispatch(addArchiveFromSource({
    type: 'ipc',
    path: '/Users/sallar/Desktop/sallar.bcup',
    isNew: false
  }));
};

rpc.on('is-in-workspace', () => {
  rpc.emit('in-workspace', getWorkspace() !== null);
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
