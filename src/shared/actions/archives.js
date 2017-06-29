import isError from 'is-error';
import { createAction } from 'redux-actions';
import { ArchiveTypes } from '../buttercup/types';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { reloadGroups } from './groups';
import {
  ARCHIVES_ADD,
  ARCHIVES_REMOVE,
  ARCHIVES_UNLOCK,
  ARCHIVES_SET_CURRENT
} from './types';

import {
  addArchiveToArchiveManager,
  removeArchiveFromArchiveManager,
  unlockArchiveInArchiveManager
} from '../buttercup/archive';

// Store Actions
export const addArchiveToStore = createAction(ARCHIVES_ADD);
export const removeArchiveFromStore = createAction(ARCHIVES_REMOVE);
export const unlockArchiveInStore = createAction(ARCHIVES_UNLOCK);
export const setCurrentArchive = createAction(ARCHIVES_SET_CURRENT);

// Impure Buttercup actions
export const removeArchive = payload => () => {
  return removeArchiveFromArchiveManager(payload);
};

export const unlockArchive = payload => () => {
  return showPasswordDialog(
    password => unlockArchiveInArchiveManager(payload, password)
  );
};

export const loadArchive = payload => async (dispatch, getState) => {
  try {
    // try to load archive by showing a password dialog
    const archiveId = await showPasswordDialog(
      password => addArchiveToArchiveManager(payload, password).catch(err => {
        const unknownMessage = 'An unknown error has occurred';
        return Promise.reject(
          isError(err)
            ? err.message || unknownMessage
            : unknownMessage
        );
      })
    );

    dispatch(setCurrentArchive(archiveId));
    // dispatch(reloadGroups());

    // Changes to interface:
    // const [width, height] = getWindowSize(getState());
    // setWindowSize(width, height, 'dark');
    // window.document.title = `${path.basename(archive.path)} - Buttercup`;
  } catch (err) { }
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

export const loadArchiveFromWebdav = ({ path, endpoint, credentials, isNew = false }, type) => dispatch => {
  dispatch(loadArchive({
    type,
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
    case ArchiveTypes.NEXTCLOUD:
    case ArchiveTypes.WEBDAV:
      dispatch(loadArchiveFromWebdav(config, type));
      break;
    case ArchiveTypes.FILE:
      dispatch(loadArchiveFromFile(config));
      break;
    default:
      break;
  }
};
