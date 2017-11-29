const fs = require('fs');
const chalk = require('chalk');
const localesConfig = require('../locales/config');

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't']
    },
    lngs: Object.keys(localesConfig.languages).map(key => key),
    ns: ['base'],
    defaultNs: 'base',
    defaultValue(lng, ns, key) {
      console.log(lng, ns, key);
      return ''; // defaultContent[key] || key
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
    const translateTagPattern = /<Translate[^]*?i18nKey="([^"]+)"[^]*?\/>/gim;

    let matched = translateTagPattern.exec(content);

    if (matched) {
      while (matched != null) {
        parser.set(matched[1], ''); // defaultContent[matched[1]] || matched[1]
        console.log(
          `custom i18next-scanner: key=${chalk.cyan(
            matched[1]
          )}, file=${chalk.yellow(JSON.stringify(file.relative))}`
        );
        matched = translateTagPattern.exec(content);
      }
    }

    done();
  }
};
