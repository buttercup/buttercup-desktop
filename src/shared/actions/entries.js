import { createAction } from 'redux-actions';
import * as entryTools from '../buttercup/entries';
import { showDialog, showConfirmDialog } from '../../renderer/system/dialog';
import {
  getCurrentGroupId,
  getCurrentArchiveId,
  getCurrentEntryMode,
  getExpandedKeys
} from '../selectors';
import i18n from '../i18n';
import { getSharedVaultManager, getSharedSearch } from '../buttercup/archive';
import {
  ENTRIES_LOADED,
  ENTRIES_SELECTED,
  ENTRIES_UPDATE,
  ENTRIES_CREATE,
  ENTRIES_DELETE,
  ENTRIES_MOVE,
  ENTRIES_CHANGE_MODE,
  ENTRIES_SET_SORT
} from './types';
import { setExpandedKeys } from '../../shared/actions/ui';
import { loadOrUnlockArchive } from '../../shared/actions/archives';
import { loadGroup } from '../../shared/actions/groups';

export const selectEntry = (entryId, isSavingNewEntry = false) => (
  dispatch,
  getState
) => {
  try {
    const currentEntryMode = getCurrentEntryMode(getState());
    (currentEntryMode === 'new' && !isSavingNewEntry) ||
    (currentEntryMode === 'edit' && !isSavingNewEntry)
      ? showConfirmDialog(i18n.t('entry.quit-unsave-entry')).then(choice =>
          choice === 0
            ? dispatch({ type: ENTRIES_SELECTED, payload: entryId })
            : null
        )
      : dispatch({
          type: ENTRIES_SELECTED,
          payload: entryId
        });
  } catch (err) {
    showDialog(err);
  }
};

export const setSortMode = createAction(ENTRIES_SET_SORT);

export const changeMode = mode => () => ({
  type: ENTRIES_CHANGE_MODE,
  payload: mode
});

export const loadEntries = (archiveId, groupId) => dispatch => {
  try {
    const entries = entryTools.loadEntries(archiveId, groupId);
    dispatch({ type: ENTRIES_LOADED, payload: entries });
  } catch (err) {
    console.error(err);
    showDialog(err);
  }
};

export const updateEntry = newValues => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());

  try {
    // First create the new entry with the data
    const entryObj = entryTools.updateEntry(archiveId, newValues);
    dispatch({
      type: ENTRIES_UPDATE,
      payload: entryObj
    });
    dispatch(changeMode('view')());
  } catch (err) {
    console.error(err);
    showDialog(err);
  }
};

export const newEntry = newValues => (dispatch, getState) => {
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
    dispatch(selectEntry(entryObj.id, true));
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
  showConfirmDialog(i18n.t('entry.are-you-sure-question')).then(resp => {
    if (resp === 0) {
      dispatch({
        type: ENTRIES_DELETE,
        payload: entryId
      });
      entryTools.deleteEntry(archiveId, entryId);
    }
  });
};

export const getMatchingEntriesForSearchTerm = term => dispatch => {
  const finder = getSharedSearch();
  const manager = getSharedVaultManager();

  const lookup = manager.unlockedSources.reduce(
    (current, next) => ({
      ...current,
      [next.vault.id]: next
    }),
    {}
  );

  return Promise.resolve(
    finder.searchByTerm(term).map(result => {
      const vault = lookup[result.vaultID].vault;
      const source = lookup[result.vaultID];
      const entry = vault.findEntryByID(result.id);

      return {
        sourceID: source.id,
        groupID: entry.getGroup().id,
        entry: entry,
        path: [
          source.name,
          ...entryTools
            .getParentGroups(entry.getGroup())
            .map(group => group.getTitle())
        ]
      };
    })
  );
};

export const selectArchiveGroupAndEntry = (archiveId, entry) => (
  dispatch,
  getState
) => {
  // load archive
  dispatch(loadOrUnlockArchive(archiveId));

  // set expanded keys and remove duplicate keys
  dispatch(
    setExpandedKeys([
      ...new Set([
        ...getExpandedKeys(getState()),
        ...entryTools.getParentGroups(entry.getGroup()).map(g => g.id)
      ])
    ])
  );

  // load group with entry
  dispatch(loadGroup(entry.getGroup().id));

  // select entry by id
  dispatch(selectEntry(entry.id));
};
