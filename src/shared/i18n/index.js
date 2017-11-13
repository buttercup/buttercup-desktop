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
  provider: null,
  allTranslations: getAllTranslationsAsObject(),
  locale: '',
  translations: {},
  /**
   * Setup language
   * @param {object} store
   * @param {string} scope
   */
  setup(store, scope) {
    this.locale =
      getSetting(store.getState(), 'locale') || config.standardLanguage;
    this.translations = this.allTranslations[this.locale];

    if (scope === 'main') {
      this.provider = new IntlProvider(
        { locale: this.locale, messages: this.translations },
        {}
      );
    }
  },
  /**
     * Used for non react files
     * @param {*} object
     */
  formatMessage({ id, defaultMessage, description }) {
    let translation = '';
    // provider is set
    if (this.provider) {
      const { intl } = this.provider.getChildContext();
      translation = intl.formatMessage({ id, defaultMessage, description });
    } else {
      translation = this.translations[id] || id;
    }

    return translation;
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
