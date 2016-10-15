import { getGroups, createGroup, deleteGroup, saveGroup, moveGroup } from '../../system/buttercup/groups';

// Constants ->

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
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    deleteGroup(workspace, id);
    dispatch(reloadGroups());
  };
}

export function addGroup(parentId, title = 'Untitled') {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    createGroup(workspace, parentId, title);
    dispatch(reloadGroups());
  };
}

export function saveGroupTitle(id, title) {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace || !title) {
      return null;
    }
    
    saveGroup(workspace, id, title);
    dispatch(reloadGroups());
  };
}

export function reloadGroups() {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    const groups = getGroups(workspace);
    dispatch(resetGroups(groups));
  };
}

export function moveGroupToParent(groupId, parentId) {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    moveGroup(workspace, groupId, parentId);
    dispatch(reloadGroups());
  };
}
