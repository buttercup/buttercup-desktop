import { app, shell, Menu } from 'electron';
import { isOSX, isWindows } from '../shared/utils/platform';
import {
  getCurrentArchiveId,
  getAllArchives,
  getSetting
} from '../shared/selectors';
import { setSetting } from '../shared/actions/settings';
import { ImportTypeInfo } from '../shared/buttercup/types';
import { openFile, openFileForImporting, newFile } from './lib/files';
import { getWindowManager } from './lib/window-manager';
import { checkForUpdates } from './lib/updater';
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
      {},
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
      { type: 'separator' },
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
    submenu: [{ role: 'minimize' }, { role: 'close' }]
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
          shell.openExternal(
            `https://github.com/buttercup/buttercup/releases/tag/v${pkg.version}`
          );
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
      submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
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

// Check for Updates...
defaultTemplate[isOSX() ? 0 : 4].submenu.splice(isOSX() ? 1 : 0, 0, {
  label: 'Check for Updates...',
  click: () => {
    checkForUpdates();
  }
});

export function setupMenu(store) {
  const state = store.getState();
  const archives = getAllArchives(state);
  const currentArchiveId = getCurrentArchiveId(state);

  // Default should be safe (always on) in case it isn't set.
  const menubarAutoHideSetting = getSetting(state, 'menubarAutoHide');
  const menubarAutoHide =
    typeof menubarAutoHideSetting === 'boolean'
      ? menubarAutoHideSetting
      : false;

  const template = defaultTemplate.map((item, i) => {
    // OSX has one more menu item
    const index = isOSX() ? i : i + 1;

    switch (index) {
      // Archive / File Menu:
      case 1:
        return {
          ...item,
          submenu: item.submenu.map((sub, i) => {
            if (i === 4) {
              return {
                label: 'Import',
                submenu: Object.entries(
                  ImportTypeInfo
                ).map(([typeKey, type]) => ({
                  label: `From ${type.name} archive (.${type.extension})`,
                  submenu: archives.map(archive => ({
                    label: `To ${archive.name}`,
                    enabled: archive.status === 'unlocked',
                    click: (item, focusedWindow) =>
                      openFileForImporting(focusedWindow, typeKey, archive.id)
                  }))
                }))
              };
            }
            return sub;
          })
        };
      // View Menu:
      case 3:
        return {
          ...item,
          submenu: [
            {
              label: 'Condensed Sidebar',
              type: 'checkbox',
              checked: getSetting(state, 'condencedSidebar'),
              accelerator: 'CmdOrCtrl+Shift+B',
              click: item => {
                store.dispatch(setSetting('condencedSidebar', item.checked));
              }
            },
            ...(isWindows()
              ? [
                  {
                    label: 'Auto Hide Menubar',
                    type: 'checkbox',
                    checked: menubarAutoHide,
                    click: item => {
                      getMainWindow().setAutoHideMenuBar(item.checked);
                      store.dispatch(
                        setSetting('menubarAutoHide', item.checked)
                      );
                    }
                  }
                ]
              : []),
            ...item.submenu
          ]
        };
      // Window Menu:
      case 4:
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
              checked: archive.id === currentArchiveId
            }))
          ]
        };
    }

    return item;
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
