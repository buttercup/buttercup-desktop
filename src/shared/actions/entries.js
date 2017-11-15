import { createAction } from 'redux-actions';
import * as entryTools from '../buttercup/entries';
import { showDialog, showConfirmDialog } from '../../renderer/system/dialog';
import { getCurrentGroupId, getCurrentArchiveId } from '../selectors';
import i18n from '../i18n';
import {
  ENTRIES_LOADED,
  ENTRIES_SELECTED,
  ENTRIES_UPDATE,
  ENTRIES_CREATE,
  ENTRIES_DELETE,
  ENTRIES_MOVE,
  ENTRIES_CHANGE_MODE,
  ENTRIES_SET_FILTER,
  ENTRIES_SET_SORT
} from './types';

export const selectEntry = createAction(ENTRIES_SELECTED);
export const setFilter = createAction(ENTRIES_SET_FILTER);
export const setSortMode = createAction(ENTRIES_SET_SORT);

export const changeMode = mode => () => ({
  type: ENTRIES_CHANGE_MODE,
  payload: mode
});

export const loadEntries = (archiveId, groupId) => ({
  type: ENTRIES_LOADED,
  payload: entryTools.loadEntries(archiveId, groupId)
});

export const updateEntry = newValues => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());

  entryTools
    .updateEntry(archiveId, newValues)
    .then(() => {
      dispatch({
        type: ENTRIES_UPDATE,
        payload: newValues
      });

      dispatch(changeMode('view')());
    })
    .catch(err => {
      showDialog(err);
    });
};

export const newEntry = newValues => (dispatch, getState) => {
  const state = getState();
  const currentGroupId = getCurrentGroupId(state);
  const archiveId = getCurrentArchiveId(state);

  if (!currentGroupId) {
    return null;
  }

  entryTools
    .createEntry(archiveId, currentGroupId, newValues)
    .then(entryObj => {
      dispatch({
        type: ENTRIES_CREATE,
        payload: entryObj
      });
      dispatch(selectEntry(entryObj.id));
    })
    .catch(err => {
      showDialog(err);
    });
};

export const moveEntry = (entryId, groupId) => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  dispatch({
    type: ENTRIES_MOVE,
    payload: {
      entryId,
      groupId
    }
  });
  entryTools.moveEntry(archiveId, entryId, groupId);
};

export const deleteEntry = entryId => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  showConfirmDialog(
    i18n.formatMessage({
      id: 'are-you-sure-question',
      defaultMessage: 'Are you sure?'
    }),
    resp => {
      if (resp === 0) {
        dispatch({
          type: ENTRIES_DELETE,
          payload: entryId
        });
        entryTools.deleteEntry(archiveId, entryId);
      }
    }
  );
};
