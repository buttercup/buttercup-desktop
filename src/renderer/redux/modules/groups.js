import * as groupTools from '../../system/buttercup/groups';

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
    
    groupTools.deleteGroup(workspace, id);
    dispatch(reloadGroups());
  };
}

export function addGroup(parentId, title = 'Untitled') {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    groupTools.createGroup(workspace, parentId, title);
    dispatch(reloadGroups());
  };
}

export function saveGroupTitle(id, title) {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace || !title) {
      return null;
    }
    
    groupTools.saveGroup(workspace, id, title);
    dispatch(reloadGroups());
  };
}

export function reloadGroups() {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    const groups = groupTools.getGroups(workspace);
    dispatch(resetGroups(groups));
  };
}

export function moveGroupToParent(groupId, parentId) {
  return (dispatch, getState) => {
    const { workspace } = getState();

    if (!workspace) {
      return null;
    }
    
    groupTools.moveGroup(workspace, groupId, parentId);
    dispatch(reloadGroups());
  };
}

export function loadGroup(groupId) {
  return dispatch => {
    console.log(groupId, 'is sick');
  };
}
