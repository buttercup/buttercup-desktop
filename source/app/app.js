"use strict";

var electron        = require('electron'),
    app             = electron.app,
    BrowserWindow   = electron.BrowserWindow,
    Menu            = electron.Menu,
    ipc             = electron.ipcMain,
    path            = require('path'),
    EventsManager   = require('./events.js')(),
    windowManager   = require('./WindowManager.js').getSharedInstance();

// Global reference of the window object
global.Buttercup = {
    config: {
        publicDir: 'file://' + path.resolve(__dirname, '../public')
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
    introScreen.loadURL(Buttercup.config.publicDir + '/intro.html');

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

// Quit when all windows are closed.
app.on('window-all-closed', function() {

});

app.on('ready', function() {
   // Show intro
   windowManager.buildWindowOfType("intro");

   // Show standard menu if on OS X
   if (process.platform == 'darwin') {
     var template = [
       {
         label: 'Buttercup',
         submenu: [
           {
             label: 'About Buttercup',
             role: 'about'
           },
           {
             type: 'separator'
           },
           {
             label: 'Services',
             role: 'services',
             submenu: []
           },
           {
             type: 'separator'
           },
           {
             label: 'Hide Buttercup',
             accelerator: 'Command+H',
             role: 'hide'
           },
           {
             label: 'Hide Others',
             accelerator: 'Command+Alt+H',
             role: 'hideothers'
           },
           {
             label: 'Show All',
             role: 'unhide'
           },
           {
             type: 'separator'
           },
           {
             label: 'Quit',
             accelerator: 'Command+Q',
             click: function() { app.quit(); }
           },
         ]
       },
       {
         label: 'Edit',
         submenu: [
           {
             label: 'Undo',
             accelerator: 'CmdOrCtrl+Z',
             role: 'undo'
           },
           {
             label: 'Redo',
             accelerator: 'Shift+CmdOrCtrl+Z',
             role: 'redo'
           },
           {
             type: 'separator'
           },
           {
             label: 'Cut',
             accelerator: 'CmdOrCtrl+X',
             role: 'cut'
           },
           {
             label: 'Copy',
             accelerator: 'CmdOrCtrl+C',
             role: 'copy'
           },
           {
             label: 'Paste',
             accelerator: 'CmdOrCtrl+V',
             role: 'paste'
           },
           {
             label: 'Select All',
             accelerator: 'CmdOrCtrl+A',
             role: 'selectall'
           },
         ]
       },
       {
         label: 'View',
         submenu: [
           {
             label: 'Reload',
             accelerator: 'CmdOrCtrl+R',
             click: function(item, focusedWindow) {
               if (focusedWindow)
                 focusedWindow.reload();
             }
           },
           {
             label: 'Toggle Full Screen',
             accelerator: (function() {
               if (process.platform == 'darwin')
                 return 'Ctrl+Command+F';
               else
                 return 'F11';
             })(),
             click: function(item, focusedWindow) {
               if (focusedWindow)
                 focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
             }
           },
           {
             label: 'Toggle Developer Tools',
             accelerator: (function() {
               if (process.platform == 'darwin')
                 return 'Alt+Command+I';
               else
                 return 'Ctrl+Shift+I';
             })(),
             click: function(item, focusedWindow) {
               if (focusedWindow)
                 focusedWindow.toggleDevTools();
             }
           },
         ]
       },
       {
         label: 'Window',
         role: 'window',
         submenu: [
           {
             label: 'Minimize',
             accelerator: 'CmdOrCtrl+M',
             role: 'minimize'
           },
           {
             label: 'Close',
             accelerator: 'CmdOrCtrl+W',
             role: 'close'
           },
           {
             type: 'separator'
           },
           {
             label: 'Bring All to Front',
             role: 'front'
           }
         ]
       },
       {
         label: 'Help',
         role: 'help',
         submenu: [
           {
             label: 'Learn More',
             click: function() { require('electron').shell.openExternal('http://buttercup.pw') }
           },
         ]
       },
     ];
   }

   var menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);
});
