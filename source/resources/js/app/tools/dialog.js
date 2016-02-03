"use strict";

// Electron
const electron = require('electron').remote;
const dialog = electron.dialog;

/**
 * Show a confirmation dialog with Yes/No buttons
 * @param  {string} message
 * @param  {string} detail
 * @return {boolean}
 */
export function confirmDialog(message, detail) {
    let result = dialog.showMessageBox({
        buttons: ['Ok', 'Cancel'],
        type: "question",
        message: message,
        detail: detail
    });

    return (result === 0);
}
