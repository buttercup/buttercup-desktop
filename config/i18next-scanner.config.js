const fs = require('fs');
const path = require('path');

// fallback language
const content = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../locales/en/template.json'),
    'utf8'
  )
);

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t']
    },
    lngs: ['en', 'de', 'fr', 'ru', 'es'],
    ns: ['translation'],
    defaultNs: 'translation',
    defaultValue(lng, ns, key) {
      return content[key] || key;
    },
    resource: {
      loadPath: 'locales/{{lng}}/template.json',
      savePath: 'locales/{{lng}}/{{ns}}.json'
    },
    nsSeparator: ':',
    keySeparator: '.',
    pluralSeparator: '_',
    contextSeparator: '_',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
};
