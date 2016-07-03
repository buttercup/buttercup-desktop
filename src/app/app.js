"use strict";

var electron        = require('electron'),
    app             = electron.app,
    BrowserWindow   = electron.BrowserWindow,
    Menu            = electron.Menu,
    ipc             = electron.ipcMain,
    path            = require('path'),
    EventsManager   = require('./events.js')(),
    windowManager   = require('./WindowManager.js').getSharedInstance(),
    menuTemplate    = require('./config/menu.js'),
    Platform        = require("./lib/platform");

// Global reference of the window object
global.Buttercup = {
    config: {
        publicDir: 'file://' + path.resolve(__dirname, '../../dist')
    }
};

// Intro Screen
windowManager.setBuildProcedure("intro", function openIntroScreen() {
    // Create the browser window.
    var introScreen = new BrowserWindow({
        width: 700,
        height: 500,
        'title-bar-style': 'hidden'
    });
    introScreen.loadURL(Buttercup.config.publicDir + '/index.html');
    //introScreen.webContents.openDevTools();

    // Emitted when the window is closed.
    introScreen.on('closed', function() {
        // Deregister the intro screen
        windowManager.deregister(introScreen);
        if (windowManager.getCountOfType("archive") <= 0) {
            // No archives open, exit app
            app.quit();
        }
    });

    return introScreen;
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

// When user closes all windows
app.on('window-all-closed', function() {
    // Reopen the Intro window
    if (windowManager.getCountOfType("archive") <= 0) {
        windowManager.buildWindowOfType("intro");
    }
});

app.on('ready', async function() {
  await installExtensions();

    // Show intro
    windowManager.buildWindowOfType("intro");

    // Show standard menu
    if (Platform.isOSX()) {
        Menu.setApplicationMenu(
            Menu.buildFromTemplate(menuTemplate)
        );
    }
});
