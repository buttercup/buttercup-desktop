import path from 'path';
import { newWorkspace, loadWorkspace } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { reloadGroups } from './groups';
import { addArchive, setCurrentArchive } from './archives';

// Action Creators ->

const fileAction = (filename, dispatch, fn) => {
  showPasswordDialog(password => {
    return fn(filename, password);
  }).then(info => {
    // @TODO: Crazy Town
    dispatch(setCurrentArchive(info.id));
    dispatch(addArchive(info.id, 'file', '', info.path));
    dispatch(reloadGroups());
    setWindowSize(950, 700, 'dark');
    window.document.title = `${path.basename(info.path)} - Buttercup`;
  });
};

export const createNewFile = filename => dispatch => {
  fileAction(filename, dispatch, newWorkspace);
};

export const openFile = filename => dispatch => {
  fileAction(filename, dispatch, loadWorkspace);
};

export const newArchive = () => () => {
  window.rpc.emit('new-file-dialog');
};

export const openArchive = () => () => {
  window.rpc.emit('open-file-dialog');
};
