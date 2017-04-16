import path from 'path';
import { createAction } from 'redux-actions';
import { loadWorkspace } from '../../renderer/system/buttercup/archive';
import { ArchiveTypes } from '../buttercup/types';
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

export const loadArchiveFromFile = ({ path, isNew = false }) => dispatch => {
  dispatch(loadArchive({
    type: ArchiveTypes.FILE,
    isNew,
    path,
    datasource: {
      path
    }
  }));
};

export const loadArchiveFromOwnCloud = ({ path, endpoint, credentials, isNew = false }) => dispatch => {
  dispatch(loadArchive({
    type: ArchiveTypes.OWNCLOUD,
    isNew,
    path,
    credentials,
    datasource: {
      endpoint,
      path
    }
  }));
};

export const loadArchiveFromWebdav = ({ path, endpoint, credentials, isNew = false }) => dispatch => {
  dispatch(loadArchive({
    type: ArchiveTypes.WEBDAV,
    isNew,
    path,
    credentials,
    datasource: {
      endpoint,
      path
    }
  }));
};

export const loadArchiveFromDropbox = ({ path, token, isNew = false }) => dispatch => {
  dispatch(loadArchive({
    type: ArchiveTypes.DROPBOX,
    isNew,
    path,
    datasource: {
      token,
      path
    }
  }));
};

export const loadArchiveFromSource = payload => dispatch => {
  const { type, ...config } = payload;
  switch (type) {
    case ArchiveTypes.DROPBOX:
      dispatch(loadArchiveFromDropbox(config));
      break;
    case ArchiveTypes.OWNCLOUD:
      dispatch(loadArchiveFromOwnCloud(config));
      break;
    case ArchiveTypes.WEBDAV:
      dispatch(loadArchiveFromWebdav(config));
      break;
    case ArchiveTypes.FILE:
      dispatch(loadArchiveFromFile(config));
      break;
    default:
      break;
  }
};
