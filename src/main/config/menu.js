const app = require('electron').app;
const Platform = require('../lib/platform');

module.exports = [
  Platform.isOSX() ? {
    label: app.getName(),
    submenu: require('./menu/app')
  } : [],
  {
    label: Platform.isOSX() ? 'Archive' : 'File',
    submenu: require('./menu/file')
  },
  {
    label: 'Edit',
    submenu: require('./menu/edit')
  },
  {
    label: 'View',
    submenu: require('./menu/view')
  },
  {
    label: 'Window',
    role: 'window',
    submenu: require('./menu/window')
  },
  {
    label: 'Help',
    role: 'help',
    submenu: require('./menu/help')
  }
];
