// @ts-check

import isError from 'is-error';
import { ipcRenderer as ipc } from 'electron';
import { createAction } from 'redux-actions';
import { ArchiveTypes } from '../buttercup/types';
import { importHistory } from '../buttercup/import';
import {
  showPasswordDialog,
  showConfirmedPasswordDialog
} from '../../renderer/system/dialog';
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
import i18n from '../i18n';

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

export const changeArchivePassword = payload => () => {
  showConfirmedPasswordDialog(
    undefined,
    {
      title: i18n.t('password-dialog.new-password')
    },
    {
      title: i18n.t('password-dialog.confirm-password')
    }
  )
    .then(password => {
      updateArchivePassword(payload, password);
    })
    .catch(() => {});
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

export const unlockArchive = payload => dispatch => {
  return showPasswordDialog(password =>
    unlockArchiveInArchiveManager(payload, password)
  )
    .then(archiveId => dispatch(loadArchive(archiveId)))
    .catch(() => {});
};

export const loadOrUnlockArchive = payload => (dispatch, getState) => {
  const archive = getArchive(getState(), payload);
  if (!archive) {
    return;
  }
  if (archive.status === 'locked') {
    dispatch(unlockArchive(payload));
  } else {
    dispatch(loadArchive(payload));
  }
};

export const addArchive = payload => async (dispatch, getState) => {
  const { isNew } = payload;
  const dispatchLoad = archiveId => dispatch(loadArchive(archiveId));
  const addToArchive = password =>
    addArchiveToArchiveManager(payload, password).catch(err => {
      const unknownMessage = i18n.t('error.unknown');
      return Promise.reject(
        isError(err) ? err.message || unknownMessage : unknownMessage
      );
    });

  // If it's not a new archive,
  // show the password dialog only once.
  if (isNew === false) {
    return showPasswordDialog(addToArchive)
      .then(dispatchLoad)
      .catch(() => {});
  }

  // Otherwise show a confirmation too.
  return showConfirmedPasswordDialog(
    addToArchive,
    {},
    {
      title: i18n.t('password-dialog.confirm-password')
    }
  )
    .then(dispatchLoad)
    .catch(() => {});
};

export const addArchiveFromFile = ({ path, isNew = false }) => dispatch => {
  dispatch(
    addArchive({
      type: ArchiveTypes.FILE,
      isNew,
      path,
      datasource: {
        path
      }
    })
  );
};

export const addArchiveFromWebdav = (
  { path, endpoint, credentials, isNew = false },
  type
) => dispatch => {
  dispatch(
    addArchive({
      type,
      isNew,
      path,
      credentials,
      datasource: {
        endpoint,
        path
      }
    })
  );
};

export const addArchiveFromDropbox = ({
  path,
  token,
  isNew = false
}) => dispatch => {
  dispatch(
    addArchive({
      type: ArchiveTypes.DROPBOX,
      isNew,
      path,
      datasource: {
        token,
        path
      }
    })
  );
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

export const importHistoryIntoArchive = payload => (dispatch, getState) => {
  const { archiveId, history } = payload;
  importHistory(archiveId, history);
  dispatch(reloadGroups());
};

export const showImportDialog = payload => () => {
  ipc.send('show-import-dialog', payload);
};
