import { IntlProvider, addLocaleData } from 'react-intl';
import { getSetting } from '../selectors';

// add all locales
import de from 'locales/de';
import en from 'locales/en';
import es from 'locales/es';

// configuration
const config = {
  defaultLanguage: 'en',
  availableLanguages: [
    {
      name: 'English',
      code: 'en',
      messages: en
    },
    {
      name: 'Deutsch',
      code: 'de',
      messages: de
    },
    {
      name: 'Español',
      code: 'es',
      messages: es
    }
  ]
};

// add available language rules from react-intl
addLocaleData(
  config.availableLanguages.map(lang =>
    require(`react-intl/locale-data/${lang.code}`)
  )
);

// get translation messages by language code
const getTranslationsByLangCode = langCode =>
  config.availableLanguages.find(lang => lang.code === langCode).messages;

/**
 * i18n object
 */
const i18n = () => ({
  provider: null,
  locale: '',
  translations: {},
  /**
   * Setup language
   * @param {object} store
   * @param {string} scope
   */
  setup(store, scope) {
    this.locale =
      getSetting(store.getState(), 'locale') || config.defaultLanguage;
    this.translations = getTranslationsByLangCode(this.locale);

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
  formatMessage({ id, defaultMessage, description, values }) {
    let translation = '';
    // provider is set
    if (this.provider) {
      const { intl } = this.provider.getChildContext();
      translation = intl.formatMessage(
        { id, defaultMessage, description },
        values
      );
    } else {
      // fallback
      translation = getTranslationsByLangCode(config.defaultLanguage)[id] || id;
    }

    return translation;
  },
  /**
   * Return config
   */
  getConfig(key) {
    if (!(key in config)) {
      throw new Error('i18n config not found.');
    }
    return config[key];
  }
});

// export wrapper for file-manager.js and index.js
export { IntlProvider };

export default i18n();
