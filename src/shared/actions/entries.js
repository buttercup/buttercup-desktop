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

export const loadEntries = (archiveId, groupId) => async (
  dispatch,
  getState
) => {
  try {
    // First load all the entries fetching their icons only from disk
    const entries = await entryTools.loadEntries(archiveId, groupId);
    dispatch({
      type: ENTRIES_LOADED,
      payload: entries
    });

    // Then download all the missing icons and update the entries
    const entriesWithoutIcon = entries.filter(entry => !entry.icon);
    await fetchEntryIconsAndUpdate(archiveId, entriesWithoutIcon, dispatch);
  } catch (err) {
    showDialog(err);
  }
};

export const updateEntry = newValues => async (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());

  try {
    // First create the new entry with the data
    await entryTools.updateEntry(archiveId, newValues);
    dispatch({
      type: ENTRIES_UPDATE,
      payload: newValues
    });
    dispatch(changeMode('view')());

    // Then update the entry icon - might be slower, so we don't want the UI to wait for this
    await fetchEntryIconsAndUpdate(archiveId, [newValues], dispatch);
  } catch (err) {
    showDialog(err);
  }
};

export const newEntry = newValues => async (dispatch, getState) => {
  const state = getState();
  const currentGroupId = getCurrentGroupId(state);
  const archiveId = getCurrentArchiveId(state);

  if (!currentGroupId) {
    return null;
  }

  try {
    // First update the entry data
    const entryObj = entryTools.createEntry(
      archiveId,
      currentGroupId,
      newValues
    );
    dispatch({
      type: ENTRIES_CREATE,
      payload: entryObj
    });
    dispatch(selectEntry(entryObj.id));

    // Then update the entry icon - might be slower, so we don't want the UI to wait for this
    await fetchEntryIconsAndUpdate(archiveId, [entryObj], dispatch);
  } catch (err) {
    showDialog(err);
  }
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
  showConfirmDialog(i18n.t('entry.are-you-sure-question'), resp => {
    if (resp === 0) {
      dispatch({
        type: ENTRIES_DELETE,
        payload: entryId
      });
      entryTools.deleteEntry(archiveId, entryId);
    }
  });
};

const fetchEntryIconsAndUpdate = async (archiveId, entries, dispatch) => {
  return Promise.all(
    entries.map(async entry => {
      const entryObjWithIcon = await entryTools.updateEntryIcon(
        archiveId,
        entry.id
      );
      dispatch({
        type: ENTRIES_UPDATE,
        payload: entryObjWithIcon
      });
    })
  );
};
