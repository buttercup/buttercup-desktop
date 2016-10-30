const WindowManager = require('../../lib/window-manager');

const windowManager = WindowManager.getSharedInstance(); 

module.exports = [
  {
    label: 'New Archive',
    accelerator: 'CmdOrCtrl+N',
    click: () => {
      windowManager.buildWindowOfType('main', (win, rpc) => {
        rpc.emit('new-archive');
      });
    }
  },
  {
    label: 'Open Archive',
    accelerator: 'CmdOrCtrl+O',
    click: () => {
      windowManager.buildWindowOfType('main', (win, rpc) => {
        rpc.emit('open-archive');
      });
    }
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
