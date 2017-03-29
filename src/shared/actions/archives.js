import path from 'path';
import { createAction } from 'redux-actions';
import { loadWorkspace, archiveTypes } from '../../renderer/system/buttercup/archive';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { getWindowSize } from '../selectors';
import { reloadGroups } from './groups';
import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_CURRENT, ARCHIVES_CLEAR } from './types';

export const addArchive = createAction(ARCHIVES_ADD, payload => ({
  ...payload,
  lastAccessed: (new Date()).getTime()
}));
export const setCurrentArchive = createAction(ARCHIVES_SET_CURRENT);
export const removeArchive = createAction(ARCHIVES_REMOVE);
export const clearArchives = createAction(ARCHIVES_CLEAR);

export const loadArchive = payload => async (dispatch, getState) => {
  const archive = await showPasswordDialog(
    password => loadWorkspace(payload, password)
  );

  dispatch(setCurrentArchive(archive.id));
  dispatch(reloadGroups());
  dispatch(addArchive(archive));

  // Changes to interface:
  const [width, height] = getWindowSize(getState());
  setWindowSize(width, height, 'dark');
  window.document.title = `${path.basename(archive.path)} - Buttercup`;
};

export const loadArchiveFromFile = (path, isNew = false) => dispatch => {
  dispatch(loadArchive({
    type: archiveTypes.FILE,
    isNew,
    path,
    datasource: {
      path
    }
  }));
};

export const loadArchiveFromOwnCloud = (endpoint, path, credentials, isNew = false) => dispatch => {
  dispatch(loadArchive({
    type: archiveTypes.OWNCLOUD,
    isNew,
    path,
    credentials,
    datasource: {
      endpoint,
      path
    }
  }));
};

export const loadArchiveFromDropbox = (path, token, isNew = false) => dispatch => {
  dispatch(loadArchive({
    type: archiveTypes.DROPBOX,
    isNew,
    path,
    datasource: {
      token,
      path
    }
  }));
};
