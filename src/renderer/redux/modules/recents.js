// Constants ->

const ADD = 'buttercup/recents/ADD';
const REMOVE = 'buttercup/recents/REMOVE';
const CLEAR = 'buttercup/recents/CLEAR';

// Reducers ->

export default function recentFilesReducer(state = [], action) {
  switch (action.type) {
    case ADD:
      if (state.indexOf(action.filename) === -1) {
        return [action.filename, ...state];
      }
      return state;
    case REMOVE:
      return state.filter(filename => filename !== action.filename);
    case CLEAR:
      return [];
    default:
      return state;
  }
}

// Action Creators ->

export const addRecent = filename => ({ type: ADD, filename });
export const removeRecent = filename => ({ type: REMOVE, filename });
export const clearRecent = () => ({ type: CLEAR });
