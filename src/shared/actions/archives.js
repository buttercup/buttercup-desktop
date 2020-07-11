// @ts-check
import { ipcRenderer as ipc } from 'electron';
import { createAction } from 'redux-actions';
import { ArchiveTypes } from '../buttercup/types';
import { importVaultFacade } from '../buttercup/import';
import { reloadGroups } from './groups';
import {
  ARCHIVES_SET,
  ARCHIVES_SET_CURRENT,
  ARCHIVES_REMOVE,
  ARCHIVES_SET_ORDER
} from './types';
import { getArchive, getCurrentArchiveId } from '../selectors';
import {
  addArchiveToVaultManager,
  lockArchiveInVaultManager,
  removeArchiveFromVaultManager,
  unlockArchiveInVaultManager,
  updateArchivePassword,
  updateArchiveColour,
  updateArchiveOrder
} from '../buttercup/archive';
import { exportVaultToCSVAndSave } from '../buttercup/export';
import {
  MYBUTTERCUP_CLIENT_ID,
  MYBUTTERCUP_CLIENT_SECRET
} from '../../shared/myButtercup';

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
  return removeArchiveFromVaultManager(payload).then(() => {
    dispatch(removeArchiveFromStore(payload));
  });
};

export const changeArchivePassword = (
  payload,
  newPassword,
  oldPassword
) => () => {
  return updateArchivePassword(payload, newPassword, oldPassword);
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
  return lockArchiveInVaultManager(payload).then(archiveId => {
    dispatch(setCurrentArchive(null));
  });
};

export const unlockArchive = (archiveId, masterPassword) => dispatch => {
  return unlockArchiveInVaultManager(archiveId, masterPassword).then(
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
  return addArchiveToVaultManager(payload, masterPassword).then(archiveId =>
    dispatch(loadArchive(archiveId))
  );
};

export const addArchiveFromSource = (payload, masterPassword) => dispatch => {
  const { type, path, isNew, ...config } = payload;
  switch (type) {
    case ArchiveTypes.MY_BUTTERCUP:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            name: config.details.name,
            datasource: {
              type,
              accessToken: config.details.accessToken,
              refreshToken: config.details.refreshToken,
              clientID: MYBUTTERCUP_CLIENT_ID,
              clientSecret: MYBUTTERCUP_CLIENT_SECRET,
              vaultID: config.details.id
            }
          },
          masterPassword
        )
      );
    case ArchiveTypes.DROPBOX:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            datasource: {
              type,
              token: config.token,
              path
            }
          },
          masterPassword
        )
      );
    case ArchiveTypes.GOOGLEDRIVE:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            datasource: {
              type,
              token: config.tokens.accessToken,
              refreshToken: config.tokens.refreshToken,
              fileID: path
            }
          },
          masterPassword
        )
      );
    case ArchiveTypes.WEBDAV:
      return dispatch(
        addArchive(
          {
            type,
            isNew,
            path,
            datasource: {
              ...config.credentials,
              type,
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
              type,
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

export const importFacadeIntoVault = payload => (dispatch, getState) => {
  const { archiveId: sourceID, vaultFacade } = payload;
  importVaultFacade(sourceID, vaultFacade);
  dispatch(reloadGroups());
};

export const showImportDialog = payload => () => {
  ipc.send('show-import-dialog', payload);
};

export const exportArchive = archiveId => dispatch => {
  exportVaultToCSVAndSave(archiveId);
};
