import Buttercup from 'buttercup-web';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import rpc from './system/rpc';
import { getWorkspace } from './system/buttercup/archive';
import { importHistoryFromRequest, showHistoryPasswordPrompt } from './system/buttercup/import';
import { copyToClipboard, setWindowSize } from './system/utils';
import configureStore from './redux/configure-store';
import * as archiveActions from './redux/modules/files';
import * as entryActions from './redux/modules/entries';
import * as uiAction from './redux/modules/ui';
import * as groupActions from './redux/modules/groups';
import Root from './containers/root';

// Make crypto faster!
Buttercup.Web.HashingTools.patchCorePBKDF();

window.__defineGetter__('rpc', () => rpc);
const store = configureStore();

setWindowSize(870, 550);

rpc.on('ready', () => {
  rpc.emit('init');
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
  const currentEntry = entryActions.getCurrentEntry(store.getState().entries);

  if (selection !== '') {
    copyToClipboard(selection);
  } else if (currentEntry) {
    copyToClipboard(currentEntry.properties.password);
  }
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

rpc.on('update-available', updateData => {
  store.dispatch(uiAction.pushUpdate(updateData));
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
