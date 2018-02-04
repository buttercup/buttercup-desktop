import i18n from 'i18next';
import localesConfig from '../../../locales/config';
import Translate from './translate';

// get all configurated languages
const languages = {};
Object.keys(localesConfig.languages).forEach((key, lang) => {
  languages[key] = {};
  languages[key].name = localesConfig.languages[key].name;

  localesConfig.types.forEach(type => {
    languages[key][type] = require('../../../locales/' +
      key +
      '/' +
      type +
      '.json');
  });
});

const resources = Object.keys(languages).reduce((accumulator, key) => {
  accumulator[key] = {};

  localesConfig.types.forEach(type => {
    accumulator[key][type] = languages[key][type];
  });

  return accumulator;
}, {});

i18n.init({
  fallbackLng: localesConfig.fallbackLng,
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
  debug: false,
  saveMissingTo: 'all',
  saveMissing: false,
  returnEmptyString: false
});

export { Translate, languages };

export default i18n;
