const ADD = 'buttercup/recents/ADD';
const REMOVE = 'buttercup/recents/REMOVE';
const CLEAR = 'buttercup/recents/CLEAR';

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

export function addRecent(filename) {
  return { type: 'ADD_REQUEST', filename };
}

export function removeRecent(filename) {
  return { type: REMOVE, filename };
}

export function clearRecent() {
  return { type: CLEAR };
}
