import { showConfirmDialog } from '../../system/dialog';
import { SET_WORKSPACE } from './workspace';

// Constants ->

const ADD = 'buttercup/recents/ADD';
const REMOVE = 'buttercup/recents/REMOVE';
const CLEAR = 'buttercup/recents/CLEAR';

// Reducers ->

export default function recentFilesReducer(state = [], action) {
  switch (action.type) {
    case ADD:
    case SET_WORKSPACE: {
      const filename = action.filename || action.payload.path;
      if (state.indexOf(filename) === -1) {
        return [filename, ...state];
      }
      return state;
    }
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
export const clearRecent = () => dispatch => {
  showConfirmDialog('Are you sure you want to clear the history?', resp => {
    if (resp === 0) {
      dispatch({ type: CLEAR });
    }
  });
};
