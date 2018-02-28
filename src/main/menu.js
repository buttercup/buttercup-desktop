import { app, shell, Menu, Tray } from 'electron';
import { isOSX, isWindows } from '../shared/utils/platform';
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
import {
  getMainWindow,
  reopenMainWindow,
  checkDockVisibility
} from './utils/window';
import i18n, { languages } from '../shared/i18n';
import pkg from '../../package.json';
import electronContextMenu from 'electron-context-menu';
import { getPathToFile } from './lib/utils';

electronContextMenu();

const label = (key, options) => i18n.t(`app-menu.${key}`, options);

let tray = null;
let isTrayIconInitialized = false;

export const setupTrayIcon = store => {
  const state = store.getState();
  const isTrayIconEnabled = getSetting(state, 'isTrayIconEnabled');

  if (isTrayIconEnabled) {
    if (!tray) {
      let trayPath = 'resources/icons/trayTemplate.png';
      if (isWindows()) {
        trayPath = 'resources/icons/tray.ico';
      }

      tray = new Tray(getPathToFile(trayPath));
    }

    const showTrayMenu = () => {
      tray.popUpContextMenu(
        Menu.buildFromTemplate([
          {
            label: label('tray.open'),
            click: () => {
              reopenMainWindow();
            }
          },
          {
            type: 'separator'
          },
          {
            label: label('archive.new'),
            click: () => {
              reopenMainWindow(win => newFile(win));
            }
          },
          {
            label: label('archive.open'),
            click: () => {
              reopenMainWindow(win => openFile(win));
            }
          },
          {
            label: label('archive.connect-cloud-sources'),
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
            label: label('tray.quit'),
            click: () => {
              app.quit();
            }
          }
        ])
      );
    };

    if (!isTrayIconInitialized) {
      tray.on('click', () => {
        showTrayMenu();
      });

      tray.on('right-click', () => {
        showTrayMenu();
      });
    }

    isTrayIconInitialized = true;
  } else {
    if (tray) {
      tray.destroy();
    }
    tray = null;
    isTrayIconInitialized = false;

    checkDockVisibility();
  }
};

export const setupMenu = store => {
  const defaultTemplate = [
    {
      label: isOSX() ? label('archive.archive') : label('archive.file'),
      submenu: [
        {
          label: label('archive.new'),
          accelerator: 'CmdOrCtrl+N',
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
        {}, // Import menu will be injected here
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
        }
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
        { role: 'about', label: label('app.about') },
        { type: 'separator' },
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
    defaultTemplate[4].submenu.push(
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

  // Check for Updates...
  defaultTemplate[isOSX() ? 0 : 4].submenu.splice(isOSX() ? 1 : 0, 0, {
    label: label('app.check-for-updates'),
    click: () => {
      checkForUpdates();
    }
  });

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
                label: label('archive.import.import'),
                submenu: Object.entries(
                  ImportTypeInfo
                ).map(([typeKey, type]) => ({
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
                            openFileForImporting(
                              focusedWindow,
                              typeKey,
                              archive.id
                            );
                          }
                        }))
                      : [
                          {
                            label: label(
                              'archive.import.no-available-archives'
                            ),
                            enabled: false
                          }
                        ]
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
              label: label('view.condensed-sidebar'),
              type: 'checkbox',
              checked: getSetting(state, 'condencedSidebar'),
              accelerator: 'CmdOrCtrl+Shift+B',
              click: item => {
                store.dispatch(setSetting('condencedSidebar', item.checked));
              }
            },
            {
              label: label('view.enable-tray-icon'),
              type: 'checkbox',
              checked: getSetting(state, 'isTrayIconEnabled'),
              click: item => {
                store.dispatch(setSetting('isTrayIconEnabled', item.checked));
                setupTrayIcon(store);
              }
            },
            { type: 'separator' },
            // Language menu point
            {
              label: label('view.language'),
              submenu: Object.keys(languages).map(key => ({
                label: languages[key].name,
                checked: getSetting(state, 'locale') === key,
                enabled: getSetting(state, 'locale') !== key,
                type: 'checkbox',
                click: () => {
                  store.dispatch(setSetting('locale', key));
                  i18n.changeLanguage(key);
                  const win = getMainWindow();
                  if (win) {
                    setupMenu(store);
                    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
                    win.webContents.send('change-locale-main', key);
                  }
                }
              }))
            },
            ...(!isOSX()
              ? [
                  {
                    label: label('view.auto-hide-menubar'),
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
        };
    }

    return item;
  });

  const buildTemplate = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(buildTemplate);
};
