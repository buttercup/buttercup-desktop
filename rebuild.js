const { execSync } = require('child_process');
const yaml = require('js-yaml');
const fs = require('fs');

const info = require('./package.json');
const appPath = 'release/mac/' + info.productName + '.app';

console.log('Zipping...');
console.log(
  execSync(
    'ditto -c -k --sequesterRsrc --keepParent "' +
      appPath +
      '" "release/' +
      info.productName +
      '-' +
      info.version +
      '-mac.zip"'
  ).toString()
);
console.log('Finished zipping!');

console.log('Collect data...');
const blockmap = JSON.parse(
  execSync(
    './node_modules/app-builder-bin/mac/app-builder blockmap -i release/' +
      info.productName +
      '-' +
      info.version +
      '-mac.zip -o release/th.zip'
  ).toString()
);
blockmap.blockMapSize = parseInt(
  execSync(
    "ls -l release/th.zip | awk '{print $5}' && rm release/th.zip"
  ).toString()
);

const doc = yaml.safeLoad(fs.readFileSync('release/latest-mac.yml', 'utf8'));

doc.files[0].sha512 = blockmap.sha512;
doc.files[0].size = blockmap.size;
doc.files[0].blockMapSize = blockmap.blockMapSize;
doc.sha512 = blockmap.sha512;

fs.writeFileSync(
  'release/latest-mac.yml',
  yaml.safeDump(doc, { lineWidth: 65535 }),
  'utf8'
);
