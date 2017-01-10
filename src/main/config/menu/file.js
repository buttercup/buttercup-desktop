import { dialog } from 'electron';
import { getWindowManager } from '../../lib/window-manager';
import { openFile, openKeepassFile, newFile } from '../../lib/files';

const windowManager = getWindowManager();

module.exports = [
  {
    label: 'New Archive',
    accelerator: 'CmdOrCtrl+N',
    click: (item, focusedWindow) => newFile(focusedWindow)
  },
  {
    label: 'Open Archive',
    accelerator: 'CmdOrCtrl+O',
    click: (item, focusedWindow) => openFile(focusedWindow)
  },
  {
    type: 'separator'
  },
  // @TODO: Gray out this option dynamically
  // when target is not available
  {
    label: 'Import',
    submenu: [
      {
        label: 'From KeePass archive',
        click: (item, focusedWindow) => {
          if (!focusedWindow) {
            return;
          }
          if (focusedWindow.isIntro()) {
            dialog.showMessageBox(focusedWindow, {
              buttons: ['OK'],
              title: 'Importing is not available',
              message: 'To import a KeePass archive file, you need to unlock a Buttercup archive first.'
            });
            return;
          }
          openKeepassFile(focusedWindow);
        }
      }
    ]
  },
  {
    type: 'separator'
  },
  {
    label: 'Open New Window',
    accelerator: 'CmdOrCtrl+Shift+N',
    click: () => {
      windowManager.buildWindowOfType('main');
    }
  },
  {
    type: 'separator'
  },
  {
    label: 'Close Window',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }
];
