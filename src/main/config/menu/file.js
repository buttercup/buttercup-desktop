import { openFile, openFileForImporting, newFile } from '../../lib/files';

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
      },
      {
        label: 'From LastPass archive (.csv)',
        click: (item, focusedWindow) => openFileForImporting(focusedWindow, 'csv')
      }
    ]
  },
  {
    type: 'separator'
  },
  {
    role: 'close'
  }
];
