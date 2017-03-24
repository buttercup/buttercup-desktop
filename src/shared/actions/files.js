import { newWorkspace, loadWorkspace } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWorkspace } from './workspace';
import { FILES_CANCELLED } from './types';

// Action Creators ->

const fileAction = (filename, dispatch, fn) => {
  showPasswordDialog(password => {
    return fn(filename, password);
  }).then(() => {
    dispatch(setWorkspace(filename));
  })
    .catch(err => {
      dispatch({
        type: FILES_CANCELLED,
        payload: {
          filename,
          reason: err
        }
      });
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
