import { app } from 'electron';
import { isOSX } from '../../lib/platform';

let menuItems = []; // eslint-disable-line import/no-mutable-exports

if (isOSX()) {
  menuItems = [
    {
      label: 'About Buttercup',
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Services',
      role: 'services',
      submenu: []
    },
    {
      type: 'separator'
    },
    {
      label: 'Hide Buttercup',
      accelerator: 'Command+H',
      role: 'hide'
    },
    {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    },
    {
      label: 'Show All',
      role: 'unhide'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit();
      }
    }
  ];
} else {
  menuItems = [
    {
      label: 'About Buttercup',
      role: 'about'
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      }
    }
  ];
}

export default menuItems;
