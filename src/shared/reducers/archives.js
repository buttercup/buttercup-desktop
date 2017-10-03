import { createIdentityReducer } from '../utils/redux';
import {
  ARCHIVES_ADD,
  ARCHIVES_REMOVE,
  ARCHIVES_LOCK,
  ARCHIVES_UNLOCK,
  ARCHIVES_SET_CURRENT,
  ARCHIVES_UPDATE
} from '../actions/types';

export default function archivesReducer(state = [], action) {
  switch (action.type) {
    case ARCHIVES_ADD:
      if (state.find(archive => archive.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];
    case ARCHIVES_REMOVE: {
      return state.filter(archive => archive.id !== action.payload);
    }
    case ARCHIVES_LOCK:
    case ARCHIVES_UNLOCK:
      return state.map(archive => {
        if (archive.id === action.payload) {
          return {
            ...archive,
            status: action.type === ARCHIVES_LOCK ? 'locked' : 'unlocked'
          };
        }
        return archive;
      });
    case ARCHIVES_UPDATE:
      return state.map(archive => {
        if (archive.id === action.payload.id) {
          return {
            ...archive,
            ...action.payload
          };
        }
        return archive;
      });
    default:
      return state;
  }
}

export const currentArchive = createIdentityReducer(ARCHIVES_SET_CURRENT, null);
