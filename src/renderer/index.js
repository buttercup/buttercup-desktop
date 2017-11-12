import Buttercup from 'buttercup/dist/buttercup-web.min';
import React from 'react';
import {
  IntlProvider,
  usersLocale,
  translationsForUsersLocale,
  setupI18n
} from '../shared/i18n';
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
import { setUIState } from '../shared/actions/ui-state';
import { showHistoryPasswordPrompt } from '../shared/buttercup/import';
import { setupShortcuts } from './system/shortcuts';
import Root from './containers/root';

// Unhandled rejections
const unhandled = require('electron-unhandled');
unhandled();

// Alter some Buttercup internals
Buttercup.Web.HashingTools.patchCorePBKDF();
Buttercup.vendor.webdavFS.setFetchMethod(window.fetch);

// Create store
const store = configureStore({}, 'renderer');

linkArchiveManagerToStore(store);
setupShortcuts(store);
setupI18n(store);

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
    })
    .catch(() => {
      ipc.send('import-history-prompt-resp', null);
    });
});

ipc.on('will-quit', () => {
  store.dispatch(setUIState('isExiting', true));
});

// show message, when locale changed
ipc.on('locale-changed', (e, payload) => {
  alert(payload);
});

render(
  <IntlProvider locale={usersLocale} messages={translationsForUsersLocale}>
    <AppContainer>
      <Root store={store} />
    </AppContainer>
  </IntlProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NewRoot = require('./containers/root').default;

    render(
      <IntlProvider locale={usersLocale} messages={translationsForUsersLocale}>
        <AppContainer>
          <NewRoot store={store} />
        </AppContainer>
      </IntlProvider>,
      document.getElementById('root')
    );
  });
}
