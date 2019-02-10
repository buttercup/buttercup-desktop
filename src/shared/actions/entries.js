import { createAction } from 'redux-actions';
import { EntryFinder } from 'buttercup/dist/buttercup-web.min';
import * as entryTools from '../buttercup/entries';
import { showDialog, showConfirmDialog } from '../../renderer/system/dialog';
import {
  getCurrentGroupId,
  getCurrentArchiveId,
  getCurrentEntryMode,
  getExpandedKeys
} from '../selectors';
import i18n from '../i18n';
import { getSharedArchiveManager, getSourceName } from '../buttercup/archive';
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
      ? showConfirmDialog(i18n.t('entry.quit-unsave-entry'), choice =>
          choice === 0
            ? dispatch({ type: ENTRIES_SELECTED, payload: entryId })
            : null
        )
      : dispatch({
          type: ENTRIES_SELECTED,
          payload: entryId
        });
  } catch (err) {
    console.error(err);
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

export const getMatchingEntriesForSearchTerm = term => dispatch => {
  const manager = getSharedArchiveManager();

  const unlockedSources = manager.unlockedSources;
  const lookup = unlockedSources.reduce(
    (current, next) => ({
      ...current,
      [next.workspace.archive.id]: next.id
    }),
    {}
  );
  const archives = unlockedSources.map(source => source.workspace.archive);
  const finder = new EntryFinder(archives);

  return Promise.all(
    finder.search(term).map(result => {
      const { entry } = result;
      const archiveId = lookup[result.archive.id];

      return {
        sourceID: archiveId,
        groupID: entry.getGroup().id,
        entry: entry,
        path: [
          getSourceName(archiveId),
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
