import { app } from 'electron';
import { isOSX } from '../lib/platform';
import appMenu from './menu/app';
import fileMenu from './menu/file';
import editMenu from './menu/edit';
import viewMenu from './menu/view';
import windowMenu from './menu/window';
import helpMenu from './menu/help';

export default [
  isOSX() ? {
    label: app.getName(),
    submenu: appMenu
  } : [],
  {
    label: isOSX() ? 'Archive' : 'File',
    submenu: fileMenu
  },
  {
    label: 'Edit',
    submenu: editMenu
  },
  {
    label: 'View',
    submenu: viewMenu
  },
  {
    label: 'Window',
    role: 'window',
    submenu: windowMenu
  },
  {
    label: 'Help',
    role: 'help',
    submenu: helpMenu
  }
];
