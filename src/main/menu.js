import { app, shell } from 'electron';
import { isOSX } from './lib/platform';
import { openFile, openFileForImporting, newFile } from './lib/files';
import pkg from '../../package.json';

const template = [
  {
    label: isOSX() ? 'Archive' : 'File',
    submenu: [
      {
        label: 'New Archive',
        accelerator: 'CmdOrCtrl+N',
        click: (item, focusedWindow) => newFile(focusedWindow)
      },
      {
        label: 'Open Archive',
        accelerator: 'CmdOrCtrl+O',
        click: (item, focusedWindow) => openFile(focusedWindow)
      },
      {
        type: 'separator'
      },
      // @TODO: Gray out this option dynamically
      // when target is not available
      {
        label: 'Import',
        submenu: [
          {
            label: 'From KeePass archive (.kdbx)',
            click: (item, focusedWindow) => openFileForImporting(focusedWindow, 'kdbx')
          },
          {
            label: 'From 1Password archive (.1pif)',
            click: (item, focusedWindow) => openFileForImporting(focusedWindow, '1pif')
          },
          {
            label: 'From LastPass archive (.csv)',
            click: (item, focusedWindow) => openFileForImporting(focusedWindow, 'csv')
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Visit Our Website',
        click: () => {
          shell.openExternal('https://buttercup.pw');
        }
      },
      {
        label: 'Privacy Policy',
        click: () => {
          shell.openExternal('https://buttercup.pw/privacy');
        }
      },
      {
        label: `View Changelog For v${pkg.version}`,
        click: () => {
          shell.openExternal(`https://github.com/buttercup/buttercup/releases/tag/v${pkg.version}`);
        }
      }
    ]
  }
];

if (isOSX()) {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });

  // Edit
  template[2].submenu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  );

  // Window
  template[4].submenu.push(
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  );
}

export default template;
