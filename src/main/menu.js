import { app, shell, Menu } from 'electron';
import { isOSX } from './lib/platform';
import { openFile, openFileForImporting, newFile } from './lib/files';
import { getWindowManager } from './lib/window-manager';
import { getMainWindow } from './utils/window';
import pkg from '../../package.json';

const defaultTemplate = [
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
        label: 'Connect Cloud Sources',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: (item, focusedWindow) => {
          getWindowManager().buildWindowOfType('file-manager', null, {
            parent: getMainWindow(focusedWindow)
          });
        }
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
  defaultTemplate.unshift({
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
  defaultTemplate[2].submenu.push(
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
  defaultTemplate[4].submenu.push(
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  );
}

export function setApplicationMenu(template = defaultTemplate) {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

export function addArchivesToMenu({ archives, currentArchiveId }) {
  if (!archives) {
    return;
  }

  const indexToUpdate = isOSX() ? 4 : 3;
  const template = defaultTemplate.map((item, i) => {
    if (i === indexToUpdate) {
      return {
        ...item,
        submenu: [
          ...item.submenu,
          { type: 'separator' },
          ...archives.map((archive, index) => ({
            label: archive.name,
            accelerator: `CmdOrCtrl+${index + 1}`,
            type: 'checkbox',
            click: () => {
              const win = getMainWindow();
              if (win) {
                win.webContents.send('set-current-archive', archive.id);
              }
            },
            checked: (archive.id === currentArchiveId)
          }))
        ]
      };
    }
    return item;
  });
  setApplicationMenu(template);
}
