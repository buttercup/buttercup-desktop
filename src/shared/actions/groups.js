import { createAction } from 'redux-actions';
import uuid from 'uuid';
import { showConfirmDialog } from '../../renderer/system/dialog';
import * as groupTools from '../buttercup/groups';
import { loadEntries } from './entries';
import i18n from '../i18n';
import { addExpandedKeys } from './ui';
import {
  getCurrentArchiveId,
  getDismissableGroupIds,
  getGroupsById,
  getTrashGroupId,
  getTrashChildrenIds
} from '../selectors';
import {
  GROUPS_SELECTED,
  GROUPS_SET_SORT,
  GROUPS_RESET,
  GROUPS_RENAME,
  GROUPS_MOVE,
  GROUPS_ADD_NEW_CHILD,
  GROUPS_DISMISS,
  GROUPS_UPDATE
} from './types';

export const resetGroups = createAction(GROUPS_RESET, payload =>
  groupTools.normalizeGroups(payload)
);
export const renameGroup = createAction(GROUPS_RENAME);
export const setSortMode = createAction(GROUPS_SET_SORT);
export const dismissGroup = createAction(GROUPS_DISMISS);
export const updateGroup = createAction(GROUPS_UPDATE);
export const moveGroup = createAction(GROUPS_MOVE);
export const setCurrentGroup = createAction(GROUPS_SELECTED);
export const addNewGroup = createAction(GROUPS_ADD_NEW_CHILD);
export const addTemporaryGroup = createAction(
  GROUPS_ADD_NEW_CHILD,
  payload => ({
    parentId: payload,
    group: {
      id: uuid.v4(),
      parentId: payload,
      title: '',
      isNew: true
    }
  })
);

export const dismissNewGroups = () => (dispatch, getState) => {
  const ids = getDismissableGroupIds(getState());
  ids.forEach(id => dispatch(dismissGroup(id)));
};

export const removeGroup = groupId => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  const isInTrash = groupTools.isGroupInTrash(archiveId, groupId);

  groupTools.deleteGroup(archiveId, groupId);

  // Delete
  if (isInTrash) {
    dispatch(dismissGroup(groupId));
  } else {
    const state = getState();
    const allGroups = getGroupsById(state);
    const fromParentId = groupTools.findParentId(allGroups, groupId);
    const toParentId = getTrashGroupId(state);

    dispatch(
      moveGroup({
        fromParentId,
        toParentId,
        groupId
      })
    );
  }
};

export const addGroup = parentId => dispatch => {
  dispatch(addExpandedKeys(parentId));
  dispatch(addTemporaryGroup(parentId));
};

export const createNewGroup = (parentId, temporaryGroupId, title) => (
  dispatch,
  getState
) => {
  const archiveId = getCurrentArchiveId(getState());
  const group = groupTools.createGroup(archiveId, parentId, title);

  dispatch(dismissNewGroups());
  dispatch(
    addNewGroup({
      parentId,
      group
    })
  );
};

export const saveGroupTitle = (groupId, title) => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  const group = groupTools.saveGroup(archiveId, groupId, title);
  dispatch(updateGroup(group));
};

export const reloadGroups = () => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  const groups = groupTools.getGroups(archiveId);
  dispatch(resetGroups(groups));

  if (groups.length > 0) {
    dispatch(loadGroup(groups[0].id));
  }
};

export const moveGroupToParent = (groupId, parentId, gapDrop) => (
  dispatch,
  getState
) => {
  const state = getState();
  const archiveId = getCurrentArchiveId(state);
  const allGroups = getGroupsById(state);
  const fromParentId = groupTools.findParentId(allGroups, groupId);
  const toParentId = gapDrop
    ? groupTools.findParentId(allGroups, parentId)
    : parentId;

  groupTools.moveGroup(archiveId, groupId, toParentId);
  dispatch({
    type: GROUPS_MOVE,
    payload: {
      fromParentId,
      toParentId,
      groupId
    }
  });
};

export const loadGroup = groupId => (dispatch, getState) => {
  const archiveId = getCurrentArchiveId(getState());
  dispatch(setCurrentGroup(groupId));
  dispatch(loadEntries(archiveId, groupId));
};

// @todo: remove expanded key from trash
export const emptyTrash = () => (dispatch, getState) => {
  const state = getState();
  const archiveId = getCurrentArchiveId(state);
  const trashIds = getTrashChildrenIds(state);

  showConfirmDialog(i18n.t('group-menu.empty-trash-question'), resp => {
    if (resp === 0) {
      trashIds.forEach(id => dispatch(dismissGroup(id)));
      groupTools.emptyTrash(archiveId);
    }
  });
};
