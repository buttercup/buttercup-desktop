import React from 'react';
import i18n, { IntlProvider } from '../shared/i18n';
import { render } from 'react-dom';
import FileManager from './components/file-manager';
import configureStore from '../shared/store/configure-store';

// Create store
const store = configureStore({}, 'renderer');

// setup i18n
i18n.setup(store);

render(
  <IntlProvider locale={i18n.locale} messages={i18n.translations}>
    <FileManager />
  </IntlProvider>,
  document.getElementById('root')
);
