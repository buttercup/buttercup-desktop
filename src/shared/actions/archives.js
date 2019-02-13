// @ts-check
import { ipcRenderer as ipc } from 'electron';
import { createAction } from 'redux-actions';
import { ArchiveTypes } from '../buttercup/types';
import { importHistory } from '../buttercup/import';
import { reloadGroups } from './groups';
import {
  ARCHIVES_SET,
  ARCHIVES_SET_CURRENT,
  ARCHIVES_REMOVE,
  ARCHIVES_SET_ORDER
} from './types';
import { getArchive, getCurrentArchiveId } from '../selectors';
import {
  addArchiveToArchiveManager,
  lockArchiveInArchiveManager,
  removeArchiveFromArchiveManager,
  unlockArchiveInArchiveManager,
  updateArchivePassword,
  updateArchiveColour,
  updateArchiveOrder
} from '../buttercup/archive';
import { exportArchiveToCSVAndSave } from '../buttercup/export';

// Store Actions
export const removeArchiveFromStore = createAction(ARCHIVES_REMOVE);
export const resetArchivesInStore = createAction(ARCHIVES_SET);
export const setCurrentArchive = createAction(ARCHIVES_SET_CURRENT);
export const reorderArchiveInStore = createAction(ARCHIVES_SET_ORDER);

// Impure Buttercup actions
export const loadArchive = payload => (dispatch, getState) => {
  if (payload === getCurrentArchiveId(getState())) {
    return;
  }
  dispatch(setCurrentArchive(payload));
  dispatch(reloadGroups());
};

export const removeArchive = payload => dispatch => {
  return removeArchiveFromArchiveManager(payload).then(() => {
    dispatch(removeArchiveFromStore(payload));
  });
};

export const changeArchivePassword = (payload, masterPassword) => () => {
  return updateArchivePassword(payload, masterPassword);
};

export const changeArchiveColour = ({ archiveId, colour }) => () => {
  updateArchiveColour(archiveId, colour);
};

export const changeArchiveOrder = ({ archiveId, order }) => dispatch => {
  // Reorder locally first, since the manager event might come in a few
  // milliseconds late, we don't want any flashes of content.
  dispatch(
    reorderArchiveInStore({
      archiveId,
      order
    })
  );
  updateArchiveOrder(archiveId, order);
};

export const lockArchive = payload => dispatch => {
  return lockArchiveInArchiveManager(payload).then(archiveId => {
    dispatch(setCurrentArchive(null));
  });
};

export const unlockArchive = (archiveId, masterPassword) => dispatch => {
  return unlockArchiveInArchiveManager(archiveId, masterPassword).then(
    archiveId => dispatch(loadArchive(archiveId))
  );
};

export const loadOrUnlockArchive = (archiveId, masterPassword) => (
  dispatch,
  getState
) => {
  const archive = getArchive(getState(), archiveId);
  if (!archive) {
    return;
  }
  if (archive.status === 'locked') {
    return dispatch(unlockArchive(archiveId, masterPassword));
  }
  return dispatch(loadArchive(archiveId));
};

export const addArchive = (payload, masterPassword) => async dispatch => {
  return addArchiveToArchiveManager(payload, masterPassword).then(archiveId =>
    dispatch(loadArchive(archiveId))
  );
};

export const addArchiveFromSource = (payload, masterPassword) => dispatch => {
  const { type, path, isNew, ...config } = payload;
  switch (type) {
    case ArchiveTypes.DROPBOX:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            datasource: {
              token: config.token,
              path
            }
          },
          masterPassword
        )
      );
    case ArchiveTypes.OWNCLOUD:
    case ArchiveTypes.NEXTCLOUD:
    case ArchiveTypes.WEBDAV:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            credentials: config.credentials,
            datasource: {
              endpoint: config.endpoint,
              path
            }
          },
          masterPassword
        )
      );
    case ArchiveTypes.FILE:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            datasource: {
              path
            }
          },
          masterPassword
        )
      );
    default:
      break;
  }
};

export const importHistoryIntoArchive = payload => (dispatch, getState) => {
  const { archiveId, history } = payload;
  importHistory(archiveId, history);
  dispatch(reloadGroups());
};

export const showImportDialog = payload => () => {
  ipc.send('show-import-dialog', payload);
};

export const exportArchive = archiveId => dispatch => {
  exportArchiveToCSVAndSave(archiveId);
};
