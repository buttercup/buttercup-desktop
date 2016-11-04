module.exports = [
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
    label: 'Copy Password',
    accelerator: 'CmdOrCtrl+C',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.rpc.emit('copy-current-password');
      }
    }
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
  }
];
