"use strict";

var electron        = require('electron'),
    app             = electron.app,
    BrowserWindow   = electron.BrowserWindow,
    ipc             = electron.ipcMain,
    path            = require('path'),
    EventsManager   = require('./events')();

// Global reference of the window object
var mainWindow = null;
global.Buttercup = {};

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    // Create the browser window.
    Buttercup.IntroScreen = new BrowserWindow({
        width: 600,
        height: 480/*,
        'title-bar-style': 'hidden'*/
    });
    Buttercup.IntroScreen.loadURL('file://' + path.resolve(__dirname, '../public/intro.html'));
    Buttercup.IntroScreen.webContents.openDevTools();

    // Emitted when the window is closed.
    Buttercup.IntroScreen.on('closed', function() {
        mainWindow = null;
    });
});
