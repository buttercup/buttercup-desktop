"use strict";

var electron        = require('electron'),
    app             = electron.app,
    BrowserWindow   = electron.BrowserWindow,
    ipc             = electron.ipcMain,
    path            = require('path'),
    EventsManager   = require('./events')();

// Global reference of the window object
global.Buttercup = {
    config: {
        publicDir: 'file://' + path.resolve(__dirname, '../public')
    }
};

// Intro Screen
function openIntroScreen() {
    // Create the browser window.
    Buttercup.IntroScreen = new BrowserWindow({
        width: 700,
        height: 500,
        'title-bar-style': 'hidden'
    });
    Buttercup.IntroScreen.loadURL(Buttercup.config.publicDir + '/intro.html');

    // Emitted when the window is closed.
    Buttercup.IntroScreen.on('closed', function() {
        Buttercup.IntroScreen = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    openIntroScreen();
});

app.on('ready', function() {
   openIntroScreen();
});
