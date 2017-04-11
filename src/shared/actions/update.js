import { ipcRenderer as ipc } from 'electron';
import { createAction } from 'redux-actions';
import { UPDATE_AVAILABLE, UPDATE_INSTALL } from './types';

export const pushUpdate = createAction(UPDATE_AVAILABLE);
export const updateInstalled = createAction(UPDATE_INSTALL);
export const installUpdate = () => dispatch => {
  dispatch(updateInstalled());
  ipc.send('quit-and-install');
};
