import { getWindowManager } from '../../lib/window-manager';
import { openFile, openFileForImporting, newFile } from '../../lib/files';

const windowManager = getWindowManager();

export default [
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
        label: 'From KeePass archive (.kdbx)',
        click: (item, focusedWindow) => openFileForImporting(focusedWindow, 'kdbx')
      },
      {
        label: 'From 1Password archive (.1pif)',
        click: (item, focusedWindow) => openFileForImporting(focusedWindow, '1pif')
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
