"use strict";

const Platform = require("../lib/platform");

module.exports = [
    {
        label: Platform.isOSX() ? "Buttercup" : "File",
        submenu: require("./menu/app")
    },
    {
        label: "Edit",
        submenu: require("./menu/edit")
    },
    {
        label: "View",
        submenu: require("./menu/view")
    },
    {
        label: "Window",
        role: "window",
        submenu: require("./menu/window")
    },
    {
        label: "Help",
        role: "help",
        submenu: require("./menu/help")
    }
];
