import React from 'react';
import { ipcRenderer as ipc } from 'electron';
import { I18nextProvider } from 'react-i18next';
import i18n from '../shared/i18n';
import { render } from 'react-dom';
import Preferences from './components/preferences';
import configureStore from '../shared/store/configure-store';
import { setSetting } from '../shared/actions/settings';
import { getSetting } from '../shared/selectors';

// Create store
const store = configureStore({}, 'renderer');

// setup i18n
i18n.changeLanguage(getSetting(store.getState(), 'locale'));

const renderPreferences = i18n =>
  render(
    <I18nextProvider i18n={i18n}>
      <Preferences />
    </I18nextProvider>,
    document.getElementById('root')
  );

// show message, when locale changed
ipc.on('change-initial-locale', (e, lang) => {
  i18n.changeLanguage(lang);
  store.dispatch(setSetting('locale', lang));
  renderPreferences(i18n);
});

ipc.on('change-locale-main', (e, lang) => {
  // refresh main menu
  ipc.send('change-locale-main', lang);
  store.dispatch(setSetting('locale', lang));
  i18n.changeLanguage(lang);
  renderPreferences(i18n);
});

renderPreferences(i18n);
