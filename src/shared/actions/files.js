import path from 'path';
import { loadWorkspace } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { getWindowSize } from '../selectors';
import { reloadGroups } from './groups';
import { addArchive, setCurrentArchive } from './archives';

// Action Creators ->

const loadArchive = archive => (dispatch, getState) => {
  dispatch(setCurrentArchive(archive.id));
  dispatch(reloadGroups());
  dispatch(addArchive(archive.id, 'file', '', archive.path));

  const [width, height] = getWindowSize(getState());
  setWindowSize(width, height, 'dark');
  window.document.title = `${path.basename(archive.path)} - Buttercup`;
};

export const createNewFile = filename => async dispatch => {
  const archive = await showPasswordDialog(password => loadWorkspace(filename, password, true));
  dispatch(loadArchive(archive));
};

export const openFile = filename => async dispatch => {
  const archive = await showPasswordDialog(password => loadWorkspace(filename, password));
  dispatch(loadArchive(archive));
};

export const newArchive = () => () => {
  window.rpc.emit('new-file-dialog');
};

export const openArchive = () => () => {
  window.rpc.emit('open-file-dialog');
};
