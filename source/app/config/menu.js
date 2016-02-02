"use strict";

const electron = require("electron");
const app = electron.app;

module.exports = [
    {
        label: "Buttercup",
        submenu: [
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
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                role: "undo"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                role: "redo"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                role: "cut"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                role: "copy"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                role: "paste"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                role: "selectall"
            }
        ]
    },
    {
        label: "View",
        submenu: [
            {
                label: "Reload",
                accelerator: "CmdOrCtrl+R",
                click: function(item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: "Toggle Full Screen",
                accelerator: (function() {
                    if (process.platform == "darwin")
                        return "Ctrl+Command+F";
                    else
                        return "F11";
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
                    if (process.platform == "darwin") {
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
        ]
    },
    {
        label: "Window",
        role: "window",
        submenu: [
            {
                label: "Minimize",
                accelerator: "CmdOrCtrl+M",
                role: "minimize"
            },
            {
                label: "Close",
                accelerator: "CmdOrCtrl+W",
                role: "close"
            },
            {
                type: "separator"
            },
            {
                label: "Bring All to Front",
                role: "front"
            }
        ]
    },
    {
        label: "Help",
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: () => {
                    electron.shell.openExternal("http://buttercup.pw")
                }
            }
        ]
    }
];
