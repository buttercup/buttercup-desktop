// Constants ->

const ADD = 'buttercup/recents/ADD';
const REMOVE = 'buttercup/recents/REMOVE';
const CLEAR = 'buttercup/recents/CLEAR';

// Reducers ->

export default function recentFilesReducer(state = [], action) {
  switch (action.type) {
    case ADD:
      return [action.filename, ...state];
    case REMOVE:
      return state.filter(filename => filename !== action.filename);
    case CLEAR:
      return [];
    default:
      return state;
  }
}

// Action Creators ->

export function addRecent(filename) {
  return { type: ADD, filename };
}

export function removeRecent(filename) {
  return { type: REMOVE, filename };
}

export function clearRecent() {
  return { type: CLEAR };
}
