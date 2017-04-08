import { ipcRenderer } from 'electron';

export const newArchive = () => () => {
  window.rpc.emit('new-file-dialog');
};

export const openArchive = () => () => {
  window.rpc.emit('open-file-dialog');
};

export const openFileManager = () => () => {
  ipcRenderer.send('show-file-manager');
};
