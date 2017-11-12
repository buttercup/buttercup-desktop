import { IntlProvider, addLocaleData } from 'react-intl';
import { getSetting } from '../selectors';

// export wrapper for file-manager.js and index.js
export { IntlProvider };

/**
 * i18n class
 */
class i18n {
  constructor() {
    this.config = {
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
      this.config.availableLanguages.map(lang =>
        require(`react-intl/locale-data/${lang.code}`)
      )
    );

    this.locale = '';
    this.translations = {};
  }
  /**
   * Setup language
   * @param {*} store
   */
  setup(store) {
    this.locale = getSetting(store.getState(), 'locale');
    this.translations = require('../../../locales/' + this.locale);
  }
  /**
   * Used for non react files
   * @param {*} object
   */
  formatMessage({ id }) {
    return this.translations[id] || id;
  }
  /**
   * Return full config or config by key
   */
  getConfig(key) {
    return this.config[key] || this.config;
  }
  /**
   * Get current locale
   */
  getLocale() {
    return this.locale;
  }
  /**
   * Get all translations of current locale
   */
  getTranslations() {
    return this.translations;
  }
}

export default new i18n();
