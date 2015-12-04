"use strict";

var app             = require('app'),
    path            = require('path'),
    BrowserWindow   = require('browser-window'),
    EventsManager   = require('./events')();

// Global reference of the window object
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        'title-bar-style': 'hidden'
    });
    mainWindow.loadUrl('file://' + path.resolve(__dirname, '../public/index.html'));
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
