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

export const resetGroups = groups => ({ type: RESET, payload: groups });
export const removeGroup = groupId => ({ type: REMOVE, id: groupId });
