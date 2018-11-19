import { app, shell, Menu } from 'electron';
import { isOSX } from '../shared/utils/platform';
import {
  getCurrentArchiveId,
  getAllArchives,
  getSetting
} from '../shared/selectors';
import { setSetting } from '../shared/actions/settings';
import { ImportTypeInfo } from '../shared/buttercup/types';
import { openFile, openFileForImporting, newFile } from './lib/files';
import { toggleArchiveSearch } from './lib/archive-search';
import { getWindowManager } from './lib/window-manager';
import { checkForUpdates } from './lib/updater';
import { getMainWindow, reopenMainWindow } from './utils/window';
import i18n from '../shared/i18n';
import pkg from '../../package.json';
import electronContextMenu from 'electron-context-menu';

electronContextMenu();

const label = (key, options) => i18n.t(`app-menu.${key}`, options);

export const setupMenu = store => {
  const state = store.getState();
  const archives = getAllArchives(state);
  const currentArchiveId = getCurrentArchiveId(state);

  // Default should be safe (always on) in case it isn't set.
  const menubarAutoHideSetting = getSetting(state, 'menubarAutoHide');
  const menubarAutoHide =
    typeof menubarAutoHideSetting === 'boolean'
      ? menubarAutoHideSetting
      : false;

  const defaultTemplate = [
    {
      label: isOSX() ? label('archive.archive') : label('archive.file'),
      submenu: [
        {
          label: label('archive.new'),
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            reopenMainWindow(win => newFile(win));
          }
        },
        {
          label: label('archive.open'),
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            reopenMainWindow(win => openFile(win));
          }
        },
        {
          label: label('archive.connect-cloud-sources'),
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            reopenMainWindow(win => {
              getWindowManager().buildWindowOfType('file-manager', null, {
                parent: win
              });
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: i18n.t('entry.add-entry'),
          accelerator: 'CmdOrCtrl+N',
          enabled: currentArchiveId !== null,
          click: () => {
            reopenMainWindow(win => {
              win.webContents.send('trigger-add-entry');
            });
          }
        },
        {
          label: i18n.t('group.new-group'),
          accelerator: 'CmdOrCtrl+G',
          enabled: currentArchiveId !== null,
          click: () => {
            reopenMainWindow(win => {
              win.webContents.send('trigger-new-group');
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: label('archive.import.import'),
          submenu: Object.entries(ImportTypeInfo).map(([typeKey, type]) => ({
            label: label('archive.import.import-from-type', {
              name: type.name,
              extension: type.extension
            }),
            submenu:
              archives.length > 0
                ? archives.map(archive => ({
                    label: label('archive.import.import-to-type', {
                      name: archive.name,
                      extension: type.extension
                    }),
                    enabled: archive.status === 'unlocked',
                    click: (item, focusedWindow) => {
                      openFileForImporting(focusedWindow, typeKey, archive.id);
                    }
                  }))
                : [
                    {
                      label: label('archive.import.no-available-archives'),
                      enabled: false
                    }
                  ]
          }))
        },
        {
          label: label('archive.export.export'),
          submenu:
            archives.length > 0
              ? archives.map(archive => ({
                  label: label('archive.export.export-archive', {
                    name: archive.name
                  }),
                  enabled: archive.status === 'unlocked',
                  click: (item, focusedWindow) => {
                    reopenMainWindow(win => {
                      win.webContents.send('export-archive', archive.id);
                    });
                  }
                }))
              : [
                  {
                    label: label('archive.export.no-available-archives'),
                    enabled: false
                  }
                ]
        },
        {
          type: 'separator'
        },
        {
          label: label('archive.search'),
          accelerator: 'CmdOrCtrl+F',
          click: (item, focusedWindow) => toggleArchiveSearch(focusedWindow)
        },
        {
          type: 'separator'
        },
        {
          role: 'close',
          label: label('archive.close')
        }
      ]
    },
    {
      label: label('edit.edit'),
      submenu: [
        {
          role: 'undo',
          label: label('edit.undo')
        },
        {
          role: 'redo',
          label: label('edit.redo')
        },
        { type: 'separator' },
        {
          role: 'cut',
          label: label('edit.cut')
        },
        {
          role: 'copy',
          label: label('edit.copy')
        },
        {
          role: 'paste',
          label: label('edit.paste')
        },
        {
          role: 'pasteandmatchstyle',
          label: label('edit.pasteandmatchstyle')
        },
        {
          role: 'delete',
          label: label('edit.delete')
        },
        {
          role: 'selectall',
          label: label('edit.selectall')
        }
      ]
    },
    {
      label: label('view.view'),
      submenu: [
        // Language menu point
        ...(!isOSX()
          ? [
              {
                label: label('view.auto-hide-menubar'),
                type: 'checkbox',
                checked: menubarAutoHide,
                click: item => {
                  getMainWindow().setAutoHideMenuBar(item.checked);
                  store.dispatch(setSetting('menubarAutoHide', item.checked));
                }
              }
            ]
          : []),
        { type: 'separator' },
        {
          role: 'reload',
          label: label('view.reload')
        },
        {
          role: 'forcereload',
          label: label('view.forcereload')
        },
        {
          role: 'toggledevtools',
          label: label('view.toggledevtools')
        },
        { type: 'separator' },
        {
          role: 'togglefullscreen',
          label: label('view.togglefullscreen')
        }
      ]
    },
    {
      label: label('window.window'),
      role: 'window',
      submenu: [
        {
          role: 'minimize',
          label: label('window.minimize')
        },
        {
          role: 'close',
          label: label('window.close')
        },
        { type: 'separator' },
        ...archives.map((archive, index) => ({
          label: archive.name,
          accelerator: `CmdOrCtrl+${index + 1}`,
          // set type to checkbox because if none of the archives are
          // selected and the type is radio, then always the first item
          // will show as active which is unwanted.
          type: currentArchiveId ? 'radio' : 'checkbox',
          click: () => {
            reopenMainWindow(win => {
              win.webContents.send('set-current-archive', archive.id);
            });
          },
          checked: archive.id === currentArchiveId
        }))
      ]
    },
    {
      label: label('help.help'),
      role: 'help',
      submenu: [
        {
          label: label('help.visit-our-website'),
          click: () => {
            shell.openExternal('https://buttercup.pw');
          }
        },
        {
          label: label('help.privacy-policy'),
          click: () => {
            shell.openExternal('https://buttercup.pw/privacy');
          }
        },
        {
          label: label('help.view-changelog-for-v', {
            version: pkg.version
          }),
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
        { role: 'services', submenu: [], label: label('app.services') },
        { type: 'separator' },
        { role: 'hide', label: label('app.hide') },
        { role: 'hideothers', label: label('app.hideothers') },
        { role: 'unhide', label: label('app.unhide') },
        { type: 'separator' },
        { role: 'quit', label: label('app.quit') }
      ]
    });

    // Edit
    defaultTemplate[2].submenu.push(
      { type: 'separator' },
      {
        label: label('edit.speech.speech'),
        submenu: [
          { role: 'startspeaking', label: label('edit.speech.startspeaking') },
          { role: 'stopspeaking', label: label('edit.speech.stopspeaking') }
        ]
      }
    );

    // Window
    defaultTemplate[4].submenu.splice(
      2,
      0,
      {
        role: 'zoom',
        label: label('window.zoom')
      },
      {
        type: 'separator'
      },
      {
        role: 'front',
        label: label('window.front')
      }
    );
  }

  // About and Check for Updates...
  // App menu on macOS and Help menu on others
  defaultTemplate[isOSX() ? 0 : 4].submenu.unshift(
    { role: 'about', label: label('app.about') },
    {
      label: label('app.check-for-updates'),
      click: () => {
        checkForUpdates();
      }
    },
    { type: 'separator' },
    {
      label: label('app.preferences'),
      accelerator: `CmdOrCtrl+,`,
      click: () => {
        if (getWindowManager().getCountOfType('app-preferences') === 0) {
          if (isOSX()) {
            app.dock.show();
          }

          reopenMainWindow(win => {
            getWindowManager().buildWindowOfType('app-preferences', null, {
              title: i18n.t('preferences.preferences'),
              titleBarStyle: 'hiddenInset'
            });
          });
        } else {
          // getWindowManager().getWindowsOfType('app-preferences').focus();
        }
      }
    },
    { type: 'separator' }
  );

  const buildTemplate = Menu.buildFromTemplate(defaultTemplate);
  Menu.setApplicationMenu(buildTemplate);
};
