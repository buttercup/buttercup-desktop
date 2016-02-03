"use strict";

const electron = require("electron");

module.exports = [
    {
        label: "Learn More",
        click: () => {
            electron.shell.openExternal("http://buttercup.pw")
        }
    }
];
