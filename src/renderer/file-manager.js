import React from 'react';
import i18n, { IntlProvider } from '../shared/i18n';
import { render } from 'react-dom';
import FileManager from './components/file-manager';

render(
  <IntlProvider locale={i18n.getLocale()} messages={i18n.getTranslations()}>
    <FileManager />
  </IntlProvider>,
  document.getElementById('root')
);
