import * as entryTools from '../../renderer/system/buttercup/entries';
import { showConfirmDialog } from '../../renderer/system/dialog';
import { getCurrentGroupId } from '../selectors';

import {
  ENTRIES_LOADED,
  ENTRIES_SELECTED,
  ENTRIES_UPDATE,
  ENTRIES_CREATE,
  ENTRIES_DELETE,
  ENTRIES_MOVE,
  ENTRIES_CHANGE_MODE,
  ENTRIES_SET_FILTER,
  ENTRIES_SET_SORT,
} from './types';

export const loadEntries = groupId => ({
  type: ENTRIES_LOADED,
  payload: entryTools.loadEntries(groupId)
});

export const selectEntry = entryId => ({
  type: ENTRIES_SELECTED,
  payload: entryId
});

export const changeMode = mode => () => ({
  type: ENTRIES_CHANGE_MODE,
  payload: mode
});

export const updateEntry = newValues => dispatch => {
  dispatch({
    type: ENTRIES_UPDATE,
    payload: newValues
  });
  entryTools.updateEntry(newValues);
  dispatch(changeMode('view')());
};

export const newEntry = newValues => (dispatch, getState) => {
  const currentGroupId = getCurrentGroupId(getState());

  if (!currentGroupId) {
    return null;
  }
  
  entryTools.createEntry(newValues, currentGroupId).then(entryObj => {
    dispatch({
      type: ENTRIES_CREATE,
      payload: entryObj
    });
    dispatch(selectEntry(entryObj.id));
  }).catch(err => {
    console.error(err);
  });
};

export const moveEntry = (entryId, groupId) => dispatch => {
  dispatch({
    type: ENTRIES_MOVE,
    payload: {
      entryId,
      groupId
    }
  });
  entryTools.moveEntry(entryId, groupId);
};

export const deleteEntry = entryId => dispatch => {
  showConfirmDialog('Are you sure?', resp => {
    if (resp === 0) {
      dispatch({
        type: ENTRIES_DELETE,
        payload: entryId
      });
      entryTools.deleteEntry(entryId);
    }
  });
};

export const setFilter = filter => ({
  type: ENTRIES_SET_FILTER,
  payload: filter
});

export const setSortMode = sortKey => ({
  type: ENTRIES_SET_SORT,
  payload: sortKey
});
