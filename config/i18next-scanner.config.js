const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

// fallback language
const content = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../locales/en/translation.json'),
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
    ns: ['translation', 'error'],
    defaultNs: 'translation',
    defaultValue(lng, ns, key) {
      return content[key] || key;
    },
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json'
    },
    nsSeparator: ':',
    keySeparator: '.',
    pluralSeparator: '_',
    contextSeparator: '-',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
  transform: function customTransform(file, enc, done) {
    'use strict';
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    const translateTagPattern = /<Translate[^]*?i18nKey="([^"]+)"[^]*?defaultText="([^"]+)"[^]*?\/>/gim;

    let matched = translateTagPattern.exec(content);

    if (matched) {
      while (matched != null) {
        parser.set(matched[1], matched[2]);
        console.log(
          `custom i18next-scanner: key=${chalk.cyan(
            matched[1]
          )} value=${chalk.cyan(matched[2])}, file=${chalk.yellow(
            JSON.stringify(file.relative)
          )}`
        );
        matched = translateTagPattern.exec(content);
      }
    }

    done();
  }
};
