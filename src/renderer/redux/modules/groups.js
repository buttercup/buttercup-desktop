import * as groupTools from '../../system/buttercup/groups';
import { loadEntries } from './entries';

// Constants ->

export const GROUP_SELECTED = 'buttercup/groups/SELECTED';
export const GROUP_ADD_CHILD = 'buttercup/groups/ADD_CHILD';
export const GROUP_MOVE = 'buttercup/groups/MOVE';
const RESET = 'buttercup/groups/RESET';
const REMOVE = 'buttercup/groups/REMOVE';

// Reducers ->

export default function groupsReducer(state = [], action) {
  switch (action.type) {
    case RESET:
      return action.payload;
    case REMOVE:
      return [];
    default:
      return state;
  }
}

// Action Creators ->

export const resetGroups = groups => ({
  type: RESET,
  payload: groups
});

export function removeGroup(id) {
  return dispatch => {
    groupTools.deleteGroup(id);
    dispatch(reloadGroups());
  };
}

export function addGroup(parentId, title = 'Untitled') {
  return dispatch => {
    groupTools.createGroup(parentId, title);
    dispatch(reloadGroups());
    dispatch({
      type: GROUP_ADD_CHILD,
      payload: {
        parentId,
        title
      }
    });
  };
}

export function saveGroupTitle(id, title) {
  return dispatch => {
    groupTools.saveGroup(id, title);
    dispatch(reloadGroups());
  };
}

export function reloadGroups() {
  return dispatch => {
    const groups = groupTools.getGroups();
    dispatch(resetGroups(groups));
  };
}

export function moveGroupToParent(groupId, parentId) {
  return dispatch => {
    groupTools.moveGroup(groupId, parentId);
    dispatch(reloadGroups());
    dispatch({
      type: GROUP_MOVE,
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
      type: GROUP_SELECTED,
      payload: groupId 
    });
    dispatch(loadEntries(groupId));
  };
}
