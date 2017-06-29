import { createIdentityReducer } from '../utils/redux';
import {
  ARCHIVES_ADD,
  ARCHIVES_REMOVE,
  ARCHIVES_UNLOCK,
  ARCHIVES_SET_CURRENT,
} from '../actions/types';

export default function archivesReducer(state = [], action) {
  switch (action.type) {
    case ARCHIVES_ADD:
      return [
        ...state,
        action.payload
      ];
    case ARCHIVES_REMOVE: {
      return state.filter(archive => archive.id !== action.payload);
    }
    case ARCHIVES_UNLOCK:
      return state.map(archive => {
        if (archive.id === action.payload) {
          return {
            ...archive,
            status: 'unlocked'
          };
        }
        return archive;
      });
    default:
      return state;
  }
}

export const currentArchive = createIdentityReducer(
  ARCHIVES_SET_CURRENT,
  null
);
