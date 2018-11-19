import { Menu, Tray } from 'electron';
import checkTraySupport from 'check-os-tray-support';
import { isWindows, isLinux, isOSX } from '../shared/utils/platform';
import { reopenMainWindow, checkDockVisibility } from './utils/window';
import { getWindowManager } from './lib/window-manager';
import { openFile, newFile } from './lib/files';
import { getSetting } from '../shared/selectors';
import i18n from '../shared/i18n';
import { getPathToFile } from './lib/utils';
import { checkForUpdates } from './lib/updater';

const isTraySupported = checkTraySupport();

let tray = null;
let isTrayIconInitialized = false;

export const setupTrayIcon = store => {
  const state = store.getState();
  const isTrayIconEnabled = getSetting(state, 'isTrayIconEnabled');
  const label = (key, options) => i18n.t(`app-menu.${key}`, options);

  if (!isTraySupported || !isTrayIconEnabled) {
    if (tray) {
      tray.destroy();
    }
    tray = null;
    isTrayIconInitialized = false;

    checkDockVisibility();
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

  const getContextMenu = () => {
    const menuTemplate = [
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
        label: label('app.preferences'),
        accelerator: `CmdOrCtrl+,`,
        click: () => {
          if (getWindowManager().getCountOfType('app-preferences') === 0) {
            getWindowManager().buildWindowOfType('app-preferences', null, {
              title: i18n.t('preferences.preferences'),
              titleBarStyle: 'hiddenInset'
            });
          }
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
    ];
    return Menu.buildFromTemplate(menuTemplate);
  };

  const showTrayMenu = () => {
    tray.popUpContextMenu(getContextMenu());
  };

  if (!isTrayIconInitialized) {
    if (isLinux()) {
      tray.setContextMenu(getContextMenu());
    } else {
      tray.on('click', () => reopenMainWindow());
      tray.on('right-click', () => showTrayMenu());
    }
  }

  isTrayIconInitialized = true;
};
