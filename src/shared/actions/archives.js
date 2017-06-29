import path from 'path';
import isError from 'is-error';
import { createAction } from 'redux-actions';
import { loadWorkspace } from '../../renderer/system/buttercup/archive';
import { ArchiveTypes } from '../buttercup/types';
import { showPasswordDialog } from '../../renderer/system/dialog';
import { setWindowSize } from '../../renderer/system/utils';
import { getWindowSize } from '../selectors';
import { reloadGroups } from './groups';
import {
  ARCHIVES_ADD,
  ARCHIVES_REMOVE,
  ARCHIVES_UNLOCK,
  ARCHIVES_SET_CURRENT,
  ARCHIVES_SET
} from './types';

import { addArchiveToArchiveManager } from '../buttercup/archive';

export const addArchive = createAction(ARCHIVES_ADD);
export const setCurrentArchive = createAction(ARCHIVES_SET_CURRENT);
export const removeArchive = createAction(ARCHIVES_REMOVE);
export const unlockArchive = createAction(ARCHIVES_UNLOCK);
export const resetArchives = createAction(ARCHIVES_SET);

export const loadArchive = payload => async (dispatch, getState) => {
  try {
    // loadWorkspace(payload, 'sallar');

    addArchiveToArchiveManager(payload, 'sallar');

    // const pass = 'sallar';
    // const archiveCredentials = createCredentials.fromPassword(pass);
    // const sourceCredentials = createCredentials("webdav");
    // sourceCredentials.username = "webdavuser";
    // sourceCredentials.password = "webdavpass";
    // sourceCredentials.setValue("datasource", JSON.stringify({
    //   type: "webdav"
    // }));

    // const id = await archiveManager.addSource("filename", sourceCredentials, archiveCredentials, isNew);

    // const source = archiveManager.sources[id];
    // source.workspace.primary.archive;
    // archiveManager.unlock(id, password);

    // const archive = await showPasswordDialog(
    //   password => loadWorkspace(payload, password).catch(err => {
    //     const unknownMessage = 'An unknown error has occurred';
    //     return Promise.reject(
    //       isError(err)
    //         ? err.message || unknownMessage
    //         : unknownMessage
    //     );
    //   })
    // );

    // dispatch(setCurrentArchive(archive.id));
    // dispatch(reloadGroups());
    // dispatch(addArchive(archive));

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
