import { ipcRenderer } from 'electron';

export const newArchive = () => () => {
  ipcRenderer.send('new-file-dialog');
};

export const openArchive = () => () => {
  ipcRenderer.send('open-file-dialog');
};

export const openFileManager = () => () => {
  ipcRenderer.send('show-file-manager');
};
