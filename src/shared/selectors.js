import { createSelector } from 'reselect';
import { sortByKey, sortDeepByKey } from './utils/collection';
import { denormalizeGroups } from './buttercup/groups';

// Archive ->

export const getArchivesCount = state => state.archives.length;
export const getAllArchives = state => state.archives;
export const getArchive = (state, archiveId) =>
  state.archives.find(archive => archive.id === archiveId);
export const getCurrentArchiveId = state => state.currentArchive;
export const getCurrentArchive = createSelector(
  state => state.archives,
  getCurrentArchiveId,
  (archives, archiveId) =>
    archives.find(archive => archive.id === archiveId) || null
);

// Settings ->

export const getAllSettings = state => state.settingsByArchiveId;
export const getCurrentArchiveSettings = createSelector(
  getAllSettings,
  getCurrentArchiveId,
  (settings, archiveId) => settings[archiveId]
);

export const getSetting = (state, key) => state.settings[key];
export const getUIState = (state, key) => state.uiState[key];

export const getExpandedKeys = createSelector(
  getCurrentArchiveSettings,
  archive => (archive ? archive.ui.treeExpandedKeys : [])
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
  state => state.entries.sortMode,
  (entries, sortMode) => sortByKey(entries, sortMode)
);

// Groups ->

export const getAllGroups = state =>
  denormalizeGroups(state.groups.shownIds, state.groups.byId);
export const getDismissableGroupIds = state =>
  Object.keys(state.groups.byId).filter(
    groupId => state.groups.byId[groupId].isNew
  );
export const getGroupsById = state => state.groups.byId;
export const getCurrentGroupId = state => state.groups.currentGroup;
export const getCurrentGroup = state =>
  state.groups.currentGroup
    ? state.groups.byId[state.groups.currentGroup]
    : null;
export const getTrashGroupId = state =>
  Object.keys(state.groups.byId).find(
    groupId => state.groups.byId[groupId].isTrash
  );

export const getTrashChildrenIds = createSelector(
  getGroupsById,
  getTrashGroupId,
  (groups, trashGroup) => groups[trashGroup].groups
);

export const getGroups = createSelector(
  getAllGroups,
  state => state.groups.sortMode,
  (groups, sortMode) => {
    const trashGroups = groups.filter(g => g.isTrash);
    const rest = groups.filter(g => !g.isTrash);

    // set depth key in group object
    const setGroupDepth = (restGroups, depth = 0) =>
      Array.isArray(restGroups) && restGroups.length > 0
        ? restGroups.map(group => {
            return {
              depth,
              ...group,
              groups: setGroupDepth(group.groups, depth + 1)
            };
          })
        : [];

    return [
      ...sortDeepByKey(setGroupDepth(rest), sortMode, 'groups'),
      ...trashGroups
    ];
  }
);
