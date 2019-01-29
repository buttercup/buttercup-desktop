import { app, BrowserWindow, ipcMain as ipc, shell } from 'electron';
import ms from 'ms';
import debounce from 'lodash/debounce';
import { isHighSierra, isOSX } from '../shared/utils/platform';
import { getWindowManager } from './lib/window-manager';
import { getSetting } from '../shared/selectors';
import { getURIPathToFile } from './lib/utils';
import { loadFile } from './lib/files';
import { config } from '../shared/config';
import { checkForUpdates } from './lib/updater';
import { setSetting } from '../shared/actions/settings';

const windowManager = getWindowManager();

export function setupWindows(store) {
  // Intro Screen
  windowManager.setBuildProcedure('main', callback => {
    const [width, height] = config.get('window.size', [950, 700]);
    const windowPosition = config.get('window.position');

    // Create the browser window.
    const win = new BrowserWindow({
      width,
      height,
      minWidth: 680,
      minHeight: 500,
      title: app.getName(),
      titleBarStyle: isOSX() && 'hiddenInset',
      // Temporary fix for High Sierra. See #339
      frame: !isOSX(),
      transparent: isOSX() && isHighSierra(),
      show: process.env.NODE_ENV === 'development',
      darkTheme: false,
      vibrancy: 'ultra-dark'
    });

    // set window position only if config exists
    if (windowPosition) {
      const [x, y] = windowPosition;
      win.setPosition(x, y);
    }

    // set current window position
    win.on(
      'move',
      debounce(() => {
        config.set('window.position', win.getPosition());
      }, 500)
    );

    win.on(
      'resize',
      debounce(() => {
        config.set('window.size', win.getSize());
      }, 500)
    );

    // Set initial menu bar visibility
    const menubarAutoHide = getSetting(store.getState(), 'menubarAutoHide');
    win.setAutoHideMenuBar(
      typeof menubarAutoHide === 'boolean' ? menubarAutoHide : false
    );

    win.loadURL(getURIPathToFile('views/index.html'));

    // When user drops a file on the window
    win.webContents.on('will-navigate', (e, url) => {
      e.preventDefault();
      loadFile(url, win);
    });

    win.on('focus', () =>
      store.dispatch(setSetting('isButtercupFocused', true))
    );
    win.on('blur', () =>
      store.dispatch(setSetting('isButtercupFocused', false))
    );

    win.once('ready-to-show', () => {
      win.show();
    });

    ipc.once('init', () => {
      if (callback) {
        callback(win);
      }

      if (!getSetting(store.getState(), 'updateOnStartDisabled')) {
        setTimeout(() => {
          checkForUpdates(true);
        }, ms('5s'));
      }
    });

    win.on('hide', () => {
      if (getSetting(store.getState(), 'lockArchiveOnMinimize')) {
        win.webContents.send('lock-all-archives');
      }
    });

    win.once('closed', () => {
      windowManager.deregister(win);
      if (isOSX() && getSetting(store.getState(), 'isTrayIconEnabled')) {
        app.dock.hide();
      }
    });

    return win;
  });

  windowManager.setBuildProcedure('file-manager', (callback, options) => {
    const win = new BrowserWindow({
      width: 650,
      height: 450,
      modal: true,
      show: false,
      resizable: false,
      ...options
    });

    win.loadURL(getURIPathToFile('views/file-manager.html'));

    win.once('ready-to-show', () => {
      win.show();
    });

    win.on('focus', () =>
      store.dispatch(setSetting('isButtercupFocused', true))
    );
    win.on('blur', () =>
      store.dispatch(setSetting('isButtercupFocused', false))
    );

    return win;
  });

  windowManager.setBuildProcedure('app-preferences', (callback, options) => {
    const [x, y] = options.parent.getPosition();
    const [width, height] = options.parent.getSize();

    const win = new BrowserWindow({
      width: 650,
      height: 558,
      minWidth: 650,
      minHeight: 558,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      x: Math.ceil(x + (width - 650) / 2),
      y: Math.ceil(y + (height - 450) / 2),
      ...options
    });
    win.setMenu(null);
    win.setAutoHideMenuBar(true);

    win.loadURL(getURIPathToFile('views/app-preferences.html'));

    win.once('ready-to-show', () => win.show());

    win.on('close', () => windowManager.deregister(win));

    win.on('focus', () =>
      store.dispatch(setSetting('isButtercupFocused', true))
    );
    win.on('blur', () =>
      store.dispatch(setSetting('isButtercupFocused', false))
    );

    return win;
  });

  windowManager.setBuildProcedure('update', (callback, options) => {
    const win = new BrowserWindow({
      width: 700,
      height: 470,
      show: false,
      resizable: false,
      ...options
    });

    win.setMenuBarVisibility(false);
    win.loadURL(getURIPathToFile('views/update.html'));

    ipc.once('init', () => {
      win.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });

      win.show();

      if (callback) {
        callback(win);
      }
    });

    return win;
  });

  windowManager.setBuildProcedure(
    'file-host-connection',
    (callback, options) => {
      const win = new BrowserWindow({
        width: 400,
        height: 200,
        modal: true,
        show: false,
        resizable: false,
        darkTheme: true,
        transparent: true,
        vibrancy: 'ultra-dark',
        ...options
      });

      win.setMenuBarVisibility(false);
      win.loadURL(getURIPathToFile('views/file-host-connection.html'));

      win.once('closed', () => {
        windowManager.deregister(win);
      });

      ipc.once('file-host-connection-init', () => {
        win.show();

        if (callback) {
          callback(win);
        }
      });

      return win;
    }
  );
}
