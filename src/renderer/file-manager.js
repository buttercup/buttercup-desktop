import React from 'react';
import { IntlProvider, usersLocale, translationsForUsersLocale } from '../i18n';
import { render } from 'react-dom';
import FileManager from './components/file-manager';

render(
  <IntlProvider locale={usersLocale} messages={translationsForUsersLocale}>
    <FileManager />
  </IntlProvider>,
  document.getElementById('root')
);
