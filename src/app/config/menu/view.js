"use strict";

const Platform = require("../../lib/platform");

module.exports = [
    {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function(item, focusedWindow) {
            if (focusedWindow) {
                focusedWindow.reload();
            }
        }
    },
    {
        label: "Toggle Full Screen",
        accelerator: (() => {
            if (Platform.isOSX()) {
                return "Ctrl+Command+F";
            }
            else {
                return "F11";
            }
        })(),
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
        }
    },
    {
        label: "Toggle Developer Tools",
        accelerator: (function() {
            if (Platform.isOSX()) {
                return "Alt+Command+I";
            }
            else {
                return "Ctrl+Shift+I";
            }
        })(),
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }
    }
];
