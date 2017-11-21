import i18n from 'i18next';

export const languages = {
  en: {
    name: 'English',
    common: require('locales/en/translation.json')
  },
  de: {
    name: 'Deutsch',
    common: require('locales/de/translation.json')
  },
  es: {
    name: 'Español',
    common: require('locales/es/translation.json')
  },
  fr: {
    name: 'Français',
    common: require('locales/fr/translation.json')
  },
  ru: {
    name: 'Русский',
    common: require('locales/ru/translation.json')
  }
};

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {
    common: languages[key].common
  };
  return accumulator;
}, {});

i18n.init({
  fallbackLng: 'en',
  resources,
  react: {
    wait: true
  },
  ns: ['common'],
  defaultNS: 'common',
  keySeparator: '.',
  nsSeparator: ':',
  debug: false
});

export default i18n;
