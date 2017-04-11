import { showConfirmDialog } from '../../renderer/system/dialog';
import * as groupTools from '../../renderer/system/buttercup/groups';
import { loadEntries } from './entries';
import { addExpandedKeys } from './ui';

import {
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_MOVE,
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS_NEW_CHILD,
} from './types';

export const resetGroups = groups => ({
  type: GROUPS_RESET,
  payload: groups
});

export function removeGroup(id) {
  return dispatch => {
    groupTools.deleteGroup(id);
    dispatch(reloadGroups());
  };
}

export function addGroup(parentId) {
  return dispatch => {
    dispatch(addExpandedKeys(parentId));
    dispatch({
      type: GROUPS_ADD_NEW_CHILD,
      payload: parentId
    });
  };
}

export const dismissNewGroup = () => ({
  type: GROUPS_DISMISS_NEW_CHILD
});

export function saveGroupTitle(parentId, title) {
  return dispatch => {
    groupTools.createGroup(parentId, title);
    dispatch(reloadGroups());
  };
}

export function reloadGroups() {
  return dispatch => {
    const groups = groupTools.getGroups();
    dispatch(resetGroups(groups));

    if (groups.length > 0) {
      dispatch(loadGroup(groups[0].id));
    }
  };
}

export function moveGroupToParent(groupId, parentId, dropToGap) {
  return dispatch => {
    groupTools.moveGroup(groupId, parentId, dropToGap);
    dispatch(reloadGroups());
    dispatch({
      type: GROUPS_MOVE,
      payload: {
        parentId,
        groupId
      }
    });
  };
}

export function loadGroup(groupId) {
  return dispatch => {
    dispatch({
      type: GROUPS_SELECTED,
      payload: groupId
    });
    dispatch(loadEntries(groupId));
  };
}

export const emptyTrash = () => dispatch => {
  showConfirmDialog('Are you sure you want to empty Trash?', () => {
    groupTools.emptyTrash();
    dispatch(reloadGroups());
  });
};

export const setSortMode = sortKey => ({
  type: GROUPS_SET_SORT,
  payload: sortKey
});
