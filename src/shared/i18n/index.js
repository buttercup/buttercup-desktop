import { IntlProvider, addLocaleData } from 'react-intl';
import { getSetting } from '../selectors';

// export wrapper for file-manager.js and index.js
export { IntlProvider };

const config = {
  standardLanguage: 'en',
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
  config.availableLanguages.map(lang =>
    require(`react-intl/locale-data/${lang.code}`)
  )
);

// add all locale files to an array for electron
const getAllTranslationsAsObject = () => {
  const translations = [];

  config.availableLanguages.forEach(lang => {
    translations[lang.code] = require(`../../../locales/${lang.code}`);
  });

  return translations;
};

/**
 * i18n object
 */
const i18n = () => ({
  allTranslations: getAllTranslationsAsObject(),
  locale: '',
  translations: {},
  /**
     * Setup language
     * @param {*} store
     */
  setup(store) {
    this.locale =
      getSetting(store.getState(), 'locale') || config.standardLanguage;
    this.translations = this.allTranslations[this.locale];
  },
  /**
     * Used for non react files
     * @param {*} object
     */
  formatMessage({ id }) {
    return this.translations[id] || id;
  },
  /**
     * Return full config or config by key
     */
  getConfig(key) {
    return config[key] || config;
  },
  /**
     * Get current locale
     */
  getLocale() {
    return this.locale;
  },
  /**
     * Get all translations of current locale
     */
  getTranslations() {
    return this.translations;
  }
});

export default i18n();
