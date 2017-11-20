import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../shared/i18n';
import { render } from 'react-dom';
import FileManager from './components/file-manager';
import configureStore from '../shared/store/configure-store';
import { getSetting } from '../shared/selectors';

// Create store
const store = configureStore({}, 'renderer');

// setup i18n
i18n.changeLanguage(getSetting(store.getState(), 'locale'));

render(
  <I18nextProvider i18n={i18n}>
    <FileManager />
  </I18nextProvider>,
  document.getElementById('root')
);
