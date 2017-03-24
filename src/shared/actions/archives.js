import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_CURRENT } from './types';

export const addArchive = (id, type, credentials, path) => ({
  type: ARCHIVES_ADD,
  payload: {
    id,
    type,
    credentials,
    path
  }
});

export const setCurrentArchive = archiveId => ({
  type: ARCHIVES_SET_CURRENT,
  payload: archiveId
});

export const removeArchive = archiveId => ({
  type: ARCHIVES_REMOVE,
  payload: archiveId
});
