import { createAction } from 'redux-actions';
import { showConfirmDialog } from '../../renderer/system/dialog';
import * as groupTools from '../../renderer/system/buttercup/groups';
import { loadEntries } from './entries';
import { addExpandedKeys } from './ui';

import {
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_MOVE,
  GROUPS_RENAME,
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS,
} from './types';

export const resetGroups = createAction(GROUPS_RESET);
export const renameGroup = createAction(GROUPS_RENAME);
export const dismissNewGroup = createAction(GROUPS_DISMISS);
export const setSortMode = createAction(GROUPS_SET_SORT);

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

export function saveGroup(isNew, groupId, title) {
  return dispatch => {
    if (isNew) {
      groupTools.createGroup(groupId, title);
    } else {
      groupTools.saveGroup(groupId, title);
    }
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
  showConfirmDialog('Are you sure you want to empty Trash?', resp => {
    if (resp === 0) {
      groupTools.emptyTrash();
      dispatch(reloadGroups());
    }
  });
};
