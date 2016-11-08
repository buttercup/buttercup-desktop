/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');

module.exports = [
  {
    label: 'Learn More',
    click: () => {
      electron.shell.openExternal('https://buttercup.pw');
    }
  }
];
