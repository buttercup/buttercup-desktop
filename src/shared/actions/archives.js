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
export const loadArchive = payload => dispatch => {
  dispatch(setCurrentArchive(payload));
  dispatch(reloadGroups());
};

export const removeArchive = payload => () => {
  return removeArchiveFromArchiveManager(payload);
};

export const unlockArchive = payload => dispatch => {
  return showPasswordDialog(
    password => unlockArchiveInArchiveManager(payload, password)
  ).then(
    archiveId => dispatch(loadArchive(archiveId))
  );
};

export const addArchive = payload => async (dispatch, getState) => {
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

    // Load the newly added archive
    dispatch(loadArchive(archiveId));

    // Changes to interface:
    // const [width, height] = getWindowSize(getState());
    // setWindowSize(width, height, 'dark');
    // window.document.title = `${path.basename(archive.path)} - Buttercup`;
  } catch (err) { }
};

export const addArchiveFromFile = ({ path, isNew = false }) => dispatch => {
  dispatch(addArchive({
    type: ArchiveTypes.FILE,
    isNew,
    path,
    datasource: {
      path
    }
  }));
};

export const addArchiveFromWebdav = ({ path, endpoint, credentials, isNew = false }, type) => dispatch => {
  dispatch(addArchive({
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

export const addArchiveFromDropbox = ({ path, token, isNew = false }) => dispatch => {
  dispatch(addArchive({
    type: ArchiveTypes.DROPBOX,
    isNew,
    path,
    datasource: {
      token,
      path
    }
  }));
};

export const addArchiveFromSource = payload => dispatch => {
  const { type, ...config } = payload;
  switch (type) {
    case ArchiveTypes.DROPBOX:
      dispatch(addArchiveFromDropbox(config));
      break;
    case ArchiveTypes.OWNCLOUD:
    case ArchiveTypes.NEXTCLOUD:
    case ArchiveTypes.WEBDAV:
      dispatch(addArchiveFromWebdav(config, type));
      break;
    case ArchiveTypes.FILE:
      dispatch(addArchiveFromFile(config));
      break;
    default:
      break;
  }
};
