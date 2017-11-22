import i18n from 'i18next';
import Translate from './translate';

export const languages = {
  en: {
    name: 'English',
    translation: require('locales/en/translation.json')
  },
  de: {
    name: 'Deutsch',
    translation: require('locales/de/translation.json')
  },
  es: {
    name: 'Español',
    translation: require('locales/es/translation.json')
  },
  fr: {
    name: 'Français',
    translation: require('locales/fr/translation.json')
  },
  ru: {
    name: 'Русский',
    translation: require('locales/ru/translation.json')
  }
};

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {
    translation: languages[key].translation
  };
  return accumulator;
}, {});

i18n.init({
  fallbackLng: 'en',
  resources,
  react: {
    wait: false
  },
  ns: ['translation'],
  defaultNS: 'translation',
  nsSeparator: ':',
  keySeparator: '.',
  pluralSeparator: '_',
  contextSeparator: '-',
  debug: false
});

export { Translate };

export default i18n;
