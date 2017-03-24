import {
  RECENTS_ADD,
  RECENTS_REMOVE,
  RECENTS_CLEAR,
  SET_WORKSPACE,
} from '../actions/types';

// Reducers ->

export default function recentFilesReducer(state = [], action) {
  switch (action.type) {
    case RECENTS_ADD:
    case SET_WORKSPACE: {
      const filename = action.filename || action.payload.path;
      if (state.indexOf(filename) === -1) {
        return [filename, ...state];
      }
      return state;
    }
    case RECENTS_REMOVE:
      return state.filter(filename => filename !== action.filename);
    case RECENTS_CLEAR:
      return [];
    default:
      return state;
  }
}
