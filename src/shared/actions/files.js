import path from 'path';
import { newWorkspace, loadWorkspace } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { getWindowSize } from '../selectors';
import { reloadGroups } from './groups';
import { addArchive, setCurrentArchive } from './archives';

// Action Creators ->

const fileAction = (filename, dispatch, getState, fn) => {
  showPasswordDialog(password => {
    return fn(filename, password);
  }).then(info => {
    // @TODO: Crazy Town
    dispatch(reloadGroups());
    dispatch(setCurrentArchive(info.id));
    dispatch(addArchive(info.id, 'file', '', info.path));
    
    // @TODO: Fix this
    setTimeout(() => {
      const [width, height] = getWindowSize(getState());
      setWindowSize(width, height, 'dark');
    }, 10);

    window.document.title = `${path.basename(info.path)} - Buttercup`;
  });
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
