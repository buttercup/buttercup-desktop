import path from 'path';
import { newWorkspace, loadWorkspace } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { getWindowSize } from '../selectors';
import { reloadGroups } from './groups';
import { addArchive, setCurrentArchive } from './archives';

// Action Creators ->

const fileAction = async (filename, dispatch, getState, fn) => {
  const info = await showPasswordDialog(password => {
    return fn(filename, password);
  });

  dispatch(setCurrentArchive(info.id));
  dispatch(reloadGroups());
  dispatch(addArchive(info.id, 'file', '', info.path));

  const [width, height] = getWindowSize(getState());
  setWindowSize(width, height, 'dark');
  window.document.title = `${path.basename(info.path)} - Buttercup`;
};

export const createNewFile = filename => (dispatch, getState) => {
  fileAction(filename, dispatch, getState, newWorkspace);
};

export const openFile = filename => (dispatch, getState) => {
  fileAction(filename, dispatch, getState, loadWorkspace);
};

export const newArchive = () => () => {
  window.rpc.emit('new-file-dialog');
};

export const openArchive = () => () => {
  window.rpc.emit('open-file-dialog');
};
