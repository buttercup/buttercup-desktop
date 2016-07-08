import path from 'path';
import { app, BrowserWindow, Menu } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import menuTemplate from './config/menu';
import Platform from './lib/platform';
import WindowManager from './lib/window-manager';

const __DEV__ = (process.env.NODE_ENV === 'development');

if (__DEV__) {
  require('electron-debug')(); // eslint-disable-line global-require
}

const windowManager = WindowManager.getSharedInstance();
const installExtensions = async () => {
  if (__DEV__) {
    const installer = require('electron-devtools-installer'); // eslint-disable global-require

    const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS);
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];

    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload); // eslint-disable-line babel/no-await-in-loop
      } catch (e) {} // eslint-disable-line xo/catch-error-name
    }
  }
};

// Intro Screen
windowManager.setBuildProcedure('intro', () => {
  // Create the browser window.
  const introScreen = new BrowserWindow({
    'width': 700,
    'height': 500,
    'title-bar-style': 'hidden'
  });

  if (__DEV__) {
    introScreen.loadURL(`file://${path.resolve(__dirname, '../../dist/index.html')}`);
    introScreen.webContents.openDevTools();
  } else {
    introScreen.loadURL(`file://${path.resolve(__dirname, './index.html')}`);
  }

  // Emitted when the window is closed.
  introScreen.on('closed', () => {
    // Deregister the intro screen
    windowManager.deregister(introScreen);
    if (windowManager.getCountOfType('archive') <= 0) {
      app.quit();
    }
  });

  return introScreen;
});

app.on('ready', async () => {
  await installExtensions();

  // Show intro
  windowManager.buildWindowOfType('intro');

  // Show standard menu
  if (Platform.isOSX()) {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate(menuTemplate)
    );
  }
});

// When user closes all windows
app.on('window-all-closed', () => {
  // Reopen the Intro window
  if (windowManager.getCountOfType('archive') <= 0) {
    windowManager.buildWindowOfType('intro');
  }
});
