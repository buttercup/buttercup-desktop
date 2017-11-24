import i18n from 'i18next';
import Translate from './translate';

export const languages = {
  en: {
    name: 'English',
    base: require('locales/en/base.json')
  },
  de: {
    name: 'Deutsch',
    base: require('locales/de/base.json')
  },
  es: {
    name: 'Español',
    base: require('locales/es/base.json')
  },
  fr: {
    name: 'Français',
    base: require('locales/fr/base.json')
  },
  ru: {
    name: 'Русский',
    base: require('locales/ru/base.json')
  },
  it: {
    name: 'Italiano',
    base: require('locales/it/base.json')
  },
  fa: {
    name: 'Persian (فارسی)',
    base: require('locales/fa/base.json')
  }
};

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {
    base: languages[key].base
  };
  return accumulator;
}, {});

i18n.init({
  fallbackLng: 'en',
  resources,
  react: {
    wait: false
  },
  ns: ['base'],
  defaultNS: 'base',
  nsSeparator: ':',
  keySeparator: '.',
  pluralSeparator: '_',
  contextSeparator: '-',
  debug: false
});

export { Translate };

export default i18n;
