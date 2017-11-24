const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

// fallback language
let content = {};
try {
  content = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../locales/en/base.json'),
      'utf8'
    ) || {}
  );
} catch (err) {
  console.log('default langauge not found');
}

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t']
    },
    lngs: ['en', 'de', 'fr', 'ru', 'es', 'it', 'fa'],
    ns: ['base'],
    defaultNs: 'base',
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
    contextSeparator: '-'
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
