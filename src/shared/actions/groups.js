import { createAction } from 'redux-actions';
import { showConfirmDialog } from '../../renderer/system/dialog';
import * as groupTools from '../buttercup/groups';
import { loadEntries } from './entries';
import { addExpandedKeys } from './ui';
import { getCurrentArchiveId } from '../selectors';
import {
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_RENAME,
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS,
} from './types';

export const resetGroups = createAction(GROUPS_RESET);
export const renameGroup = createAction(GROUPS_RENAME);
export const dismissNewGroup = createAction(GROUPS_DISMISS);
export const setSortMode = createAction(GROUPS_SET_SORT);

export const removeGroup = groupId => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  groupTools.deleteGroup(archiveId, groupId);
  dispatch(reloadGroups());
};

export const addGroup = parentId => dispatch => {
  dispatch(addExpandedKeys(parentId));
  dispatch({
    type: GROUPS_ADD_NEW_CHILD,
    payload: parentId
  });
};

export const saveGroup = (isNew, groupId, title) => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  if (isNew) {
    groupTools.createGroup(archiveId, groupId, title);
  } else {
    groupTools.saveGroup(archiveId, groupId, title);
  }
  dispatch(reloadGroups());
};

export const reloadGroups = () => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  const groups = groupTools.getGroups(archiveId);
  dispatch(resetGroups(groups));

  if (groups.length > 0) {
    dispatch(loadGroup(groups[0].id));
  }
};

export const moveGroupToParent = (groupId, parentId, dropToGap) => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  groupTools.moveGroup(archiveId, groupId, parentId, dropToGap);
  dispatch(reloadGroups());
  // dispatch({
  //   type: GROUPS_MOVE,
  //   payload: {
  //     parentId,
  //     groupId
  //   }
  // });
};

export const loadGroup = groupId => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  dispatch({
    type: GROUPS_SELECTED,
    payload: groupId
  });
  dispatch(loadEntries(archiveId, groupId));
};

export const emptyTrash = () => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  showConfirmDialog('Are you sure you want to empty Trash?', resp => {
    if (resp === 0) {
      groupTools.emptyTrash(archiveId);
      dispatch(reloadGroups());
    }
  });
};
