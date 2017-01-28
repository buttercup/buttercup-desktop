import { isOSX } from '../../lib/platform';

export default [
  {
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  },
  {
    label: 'Toggle Full Screen',
    accelerator: (() => {
      if (isOSX()) {
        return 'Ctrl+Command+F';
      }
      return 'F11';
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }
  },
  {
    label: 'Toggle Developer Tools',
    accelerator: (function() {
      if (isOSX()) {
        return 'Alt+Command+I';
      }
      return 'Ctrl+Shift+I';
    })(),
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  }
];
