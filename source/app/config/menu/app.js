"use strict";

const Platform = require("../../lib/platform");
const electron = require("electron");
const app = electron.app;
let menuItems = [];

if (Platform.isOSX()) {
    menuItems = [
        {
            label: "About Buttercup",
            role: "about"
        },
        {
            type: "separator"
        },
        {
            label: "Services",
            role: "services",
            submenu: []
        },
        {
            type: "separator"
        },
        {
            label: "Hide Buttercup",
            accelerator: "Command+H",
            role: "hide"
        },
        {
            label: "Hide Others",
            accelerator: "Command+Alt+H",
            role: "hideothers"
        },
        {
            label: "Show All",
            role: "unhide"
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            accelerator: "Command+Q",
            click: () => {
                app.quit();
            }
        }
    ];
} else {
    menuItems = [
        {
            label: "About Buttercup",
            role: "about"
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: () => {
                app.quit();
            }
        }
    ];
}

module.exports = menuItems;
