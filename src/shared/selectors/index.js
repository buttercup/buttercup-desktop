import { createSelector } from 'reselect';
import {
  filterByText,
  sortByKey,
  sortDeepByKey,
  sortByLastAccessed,
  deepFindById
} from '../utils/collection';

// Archive ->

export const getAllArchives = state => Object.values(state.archives);
export const getSortedArchives = createSelector(
  getAllArchives,
  archives => sortByLastAccessed(archives)
);

export const getCurrentArchiveId = state => state.currentArchive;
export const getCurrentArchive = createSelector(
  state => state.archives,
  getCurrentArchiveId,
  (archives, archiveId) => archives[archiveId] || null
);

// Settings ->

export const getAllSettings = state => state.settingsByArchiveId;
export const getCurrentArchiveSettings = createSelector(
  getAllSettings,
  getCurrentArchiveId,
  (settings, archiveId) => settings[archiveId]
);

// UI ->

export const getExpandedKeys = createSelector(
  getCurrentArchiveSettings,
  archive => archive ? archive.ui.treeExpandedKeys : []
);

export const getColumnSizes = createSelector(
  getCurrentArchiveSettings,
  archive => archive ? archive.ui.columnSizes : null
);

export const getWindowSize = createSelector(
  getCurrentArchiveSettings,
  archive => archive ? archive.ui.windowSize : [950, 700]
);

// Entries ->

export const getAllEntries = state => state.entries.byId;
export const getCurrentEntryId = state => state.entries.currentEntry;

export const getCurrentEntry = createSelector(
  getAllEntries,
  getCurrentEntryId,
  (entries, entryId) => entries[entryId]
);

export const getVisibleEntries = createSelector(
  getAllEntries,
  state => state.entries.shownIds,
  (entries, ids) => ids.map(id => entries[id])
);

export const getEntries = createSelector(
  getVisibleEntries,
  state => state.entries.filter,
  state => state.entries.sortMode,
  (entries, filter, sortMode) => {
    if (filter && filter.length > 0) {
      return filterByText(entries, filter);
    }

    return sortByKey(entries, sortMode);
  }
);

// Groups ->

export const getAllGroups = state => state.groups.byId;
export const getCurrentGroupId = state => state.groups.currentGroup;

export const getCurrentGroup = createSelector(
  getAllGroups,
  getCurrentGroupId,
  (groups, groupId) => deepFindById(groups, groupId, 'groups')
);

export const getGroups = createSelector(
  getAllGroups,
  state => state.groups.sortMode,
  (groups, sortMode) => {
    const trashGroups = groups.filter(g => g.isTrash);
    const rest = groups.filter(g => !g.isTrash);
    return [
      ...sortDeepByKey(rest, sortMode, 'groups'),
      ...trashGroups
    ];
  }
);
