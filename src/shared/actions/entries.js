import { createAction } from 'redux-actions';
import * as entryTools from '../buttercup/entries';
import { showDialog, showConfirmDialog } from '../../renderer/system/dialog';
import { getQueue } from '../../renderer/system/queue';
import { getCurrentGroupId, getCurrentArchiveId } from '../selectors';
import i18n from '../i18n';
import { EntryFinder } from 'buttercup/dist/buttercup-web.min';
import { getSharedArchiveManager } from '../buttercup/archive';
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

import { loadOrUnlockArchive } from '../../shared/actions/archives';
import { loadGroup } from '../../shared/actions/groups';

export const selectEntry = createAction(ENTRIES_SELECTED);
export const setSortMode = createAction(ENTRIES_SET_SORT);

export const changeMode = mode => () => ({
  type: ENTRIES_CHANGE_MODE,
  payload: mode
});

export const loadEntries = (archiveId, groupId) => async dispatch => {
  try {
    const entries = await entryTools.loadEntries(archiveId, groupId);
    dispatch({ type: ENTRIES_LOADED, payload: entries });

    const entriesWithoutIcon = entries.filter(entry => !entry.icon);
    dispatch(fetchEntryIconsAndUpdate(archiveId, entriesWithoutIcon));
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
    dispatch(fetchEntryIconsAndUpdate(archiveId, [newValues]));
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
    dispatch(fetchEntryIconsAndUpdate(archiveId, [entryObj]));
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

const fetchEntryIconsAndUpdate = (archiveId, entries) => dispatch => {
  entries.forEach(entry => {
    getQueue()
      .channel('icons')
      .enqueue(() => {
        return entryTools.updateEntryIcon(archiveId, entry.id).then(entry => {
          if (entry.icon) {
            return dispatch({ type: ENTRIES_UPDATE, payload: entry });
          }
        });
      });
  });
};

export async function getMatchingEntriesForSearchTerm(term) {
  const manager = getSharedArchiveManager();

  const unlockedSources = manager.unlockedSources;
  const lookup = unlockedSources.reduce(
    (current, next) => ({
      ...current,
      [next.workspace.primary.archive.getID()]: next.id
    }),
    {}
  );
  const archives = unlockedSources.map(
    source => source.workspace.primary.archive
  );
  const finder = new EntryFinder(archives);

  return Promise.all(
    finder.search(term).map(async result => {
      const archiveId = lookup[result.archive.getID()];

      return {
        sourceID: archiveId,
        groupID: result.entry.getGroup().getID(),
        icon: await entryTools.getIcon(result.entry),
        entry: result.entry
      };
    })
  );
}

export function getNameForSource(sourceID) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(sourceID);

  if (!source) {
    throw new Error(
      `Unable to fetch source information: No source found for ID: ${sourceID}`
    );
  }
  return source.name;
}

export const selectArchiveGroupAndEntry = (archiveId, entry) => (
  dispatch,
  getState
) => {
  dispatch(loadOrUnlockArchive(archiveId));
  dispatch(loadGroup(entry.getGroup().getID()));
  dispatch(selectEntry(entry.getID()));
};
