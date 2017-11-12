import { IntlProvider, addLocaleData } from 'react-intl';
import { getSetting } from '../selectors';

const i18nConfig = {
  standardLanguage: 'en',
  languagePath: '../../../locales/',
  availableLanguages: [
    {
      name: 'English',
      code: 'en'
    },
    {
      name: 'Deutsch',
      code: 'de'
    },
    {
      name: 'Español',
      code: 'es'
    }
  ]
};

// add available language rules from react-intl
addLocaleData(
  i18nConfig.availableLanguages.map(lang =>
    require(`react-intl/locale-data/${lang.code}`)
  )
);

// load language messages
let usersLocale = i18nConfig.standardLanguage;

// load language object
let translationsForUsersLocale = require(`../../../locales/${usersLocale}`);

const setupI18n = store => {
  const locale = getSetting(store.getState(), 'locale');
  usersLocale = locale;
  translationsForUsersLocale = require(`../../../locales/${usersLocale}`);
};

// only for non react files
const formatMessage = ({ id }) => translationsForUsersLocale[id] || id;

export {
  usersLocale,
  translationsForUsersLocale,
  IntlProvider,
  formatMessage,
  i18nConfig,
  setupI18n
};
