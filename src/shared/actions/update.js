import { ipcRenderer as ipc } from 'electron';
import { createAction } from 'redux-actions';
import { UPDATE_AVAILABLE } from './types';

export const pushUpdate = createAction(UPDATE_AVAILABLE);
export const installUpdate = () => () => {
  ipc.send('quit-and-install');
};
