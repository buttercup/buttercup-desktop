import path from 'path';
// import { createAction } from 'redux-actions';
import { setWindowSize } from '../../renderer/system/utils';
import { reloadGroups } from './groups';
import { SET_WORKSPACE } from './types';

// export const setWorkspace = createAction(SET_WORKSPACE, archivePath => {
//   setWindowSize(950, 700, 'dark');
//   window.document.title = `${path.basename(archivePath)} - Buttercup`;
//   console.log(archivePath);
//   return Promise.resolve(archivePath);
// });

export const setWorkspace = archivePath => dispatch => {
  setWindowSize(950, 700, 'dark');
  window.document.title = `${path.basename(archivePath)} - Buttercup`;

  dispatch({
    type: SET_WORKSPACE,
    payload: {
      path: archivePath
    }
  });
  dispatch(reloadGroups());
};
