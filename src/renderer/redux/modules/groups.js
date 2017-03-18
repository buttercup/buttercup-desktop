import { combineReducers } from 'redux';
import { showConfirmDialog } from '../../system/dialog';
import * as groupTools from '../../system/buttercup/groups';
import { sortRecursivelyByKey } from '../../system/utils';
import { loadEntries } from './entries';

// Constants ->

export const GROUP_SELECTED = 'buttercup/groups/SELECTED';
export const GROUP_ADD_CHILD = 'buttercup/groups/ADD_CHILD';
export const GROUP_MOVE = 'buttercup/groups/MOVE';
export const GROUPS_SET_SORT = 'buttercup/groups/SET_SORT';
const RESET = 'buttercup/groups/RESET';
const REMOVE = 'buttercup/groups/REMOVE';

// Reducers ->

function currentGroup(state = null, action) {
  switch (action.type) {
    case GROUP_SELECTED:
      return action.payload;
    default:
      return state;
  }
}

function groups(state = [], action) {
  switch (action.type) {
    case RESET:
      return action.payload;
    case REMOVE:
      return [];
    default:
      return state;
  }
}

function sortMode(state = 'title-asc', action) {
  switch (action.type) {
    case GROUPS_SET_SORT:
      return action.payload;
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

// Selectors -> 

export const getGroups = state => {
  const trashGroups = state.byId.filter(g => g.isTrash);
  const rest = state.byId.filter(g => !g.isTrash);
  return [
    ...sortRecursivelyByKey(rest, state.sortMode, 'groups'),
    ...trashGroups
  ];
};

export const getCurrentGroup = state =>
  state.currentGroup;

export default combineReducers({
  byId: groups,
  currentGroup,
  sortMode
});
