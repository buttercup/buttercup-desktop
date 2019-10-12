import { Menu, Tray } from 'electron';
import checkTraySupport from 'check-os-tray-support';
import { isWindows, isLinux, isOSX } from '../shared/utils/platform';
import { reopenMainWindow } from './utils/window';
import { getWindowManager } from './lib/window-manager';
import { openFile, newFile } from './lib/files';
import { getSetting } from '../shared/selectors';
import { setSetting } from '../shared/actions/settings';

import { setupDockIcon } from './dock';
import i18n from '../shared/i18n';
import { getPathToFile } from './lib/utils';
import { checkForUpdates } from './lib/updater';

const label = (key, options) => i18n.t(`app-menu.${key}`, options);
const isTraySupported = checkTraySupport();

let tray = null;
let isTrayIconInitialized = false;

export const setupTrayIcon = store => {
  const state = store.getState();
  const isTrayIconEnabled = getSetting(state, 'isTrayIconEnabled');

  if (!isTraySupported || !isTrayIconEnabled) {
    if (tray) {
      tray.destroy();
    }
    tray = null;
    isTrayIconInitialized = false;

    return;
  }

  if (!tray) {
    const trayPath = isWindows()
      ? 'resources/icons/tray.ico'
      : isLinux()
      ? 'resources/icons/tray-linux.png'
      : 'resources/icons/trayTemplate.png';

    tray = new Tray(getPathToFile(trayPath));
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: label('tray.open'),
      click: () => {
        reopenMainWindow();
      }
    },
    {
      type: 'separator'
    },
    { role: 'about', label: label('app.about') },
    {
      label: label('app.check-for-updates'),
      click: () => {
        checkForUpdates();
      }
    },
    {
      label: label('view.enable-dock-icon'),
      type: 'checkbox',
      checked: getSetting(state, 'isDockIconEnabled'),
      visible: isOSX(),
      click: item => {
        store.dispatch(setSetting('isDockIconEnabled', item.checked));
        setupDockIcon(store);
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
    { role: 'quit', label: label('app.quit'), accelerator: 'CmdOrCtrl+Q' }
  ]);

  const showTrayMenu = () => {
    tray.popUpContextMenu(contextMenu);
  };

  if (!isTrayIconInitialized) {
    if (isLinux()) {
      tray.setContextMenu(contextMenu);
    } else {
      tray.on('click', () => reopenMainWindow());
      tray.on('right-click', () => showTrayMenu());
    }
  }

  isTrayIconInitialized = true;
};
