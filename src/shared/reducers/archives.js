import { ARCHIVES_ADD } from '../actions/types';

export default function archivesReducer(state = {}, action) {
  switch (action.type) {
    case ARCHIVES_ADD:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    default:
      return state;
  }
}

export const getArchive = (state, archiveId) => state[archiveId];
