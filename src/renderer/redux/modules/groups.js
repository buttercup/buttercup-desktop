// Constants ->

const RESET = 'buttercup/groups/RESET';

// Reducers ->

export default function groupsReducer(state = [], action) {
  switch (action.type) {
    case RESET:
      return action.payload;
    default:
      return state;
  }
}

// Action Creators ->

export const resetGroups = groups => ({ type: RESET, payload: groups });
