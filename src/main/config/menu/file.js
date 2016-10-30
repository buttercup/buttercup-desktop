const WindowManager = require('../../lib/window-manager');

const windowManager = WindowManager.getSharedInstance(); 

function conditionalEmmit(focusedWindow, action) {
  focusedWindow.rpc.emit('is-in-workspace');
  focusedWindow.rpc.once('in-workspace', inWorkspace => {
    if (inWorkspace) {
      windowManager.buildWindowOfType('main', (win, rpc) => {
        rpc.emit(action);
      });
    } else {
      focusedWindow.rpc.emit(action);
    }
  });
}

module.exports = [
  {
    label: 'New Archive',
    accelerator: 'CmdOrCtrl+N',
    click: (item, focusedWindow) => conditionalEmmit(focusedWindow, 'new-archive')
  },
  {
    label: 'Open Archive',
    accelerator: 'CmdOrCtrl+O',
    click: (item, focusedWindow) => conditionalEmmit(focusedWindow, 'open-archive')
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
