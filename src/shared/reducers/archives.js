import { createIdentityReducer } from '../utils/redux';
import { ARCHIVES_SET, ARCHIVES_SET_CURRENT } from '../actions/types';

export default function archivesReducer(state = [], action) {
  switch (action.type) {
    case ARCHIVES_SET:
      return action.payload;
    default:
      return state;
  }
}

export const currentArchive = createIdentityReducer(ARCHIVES_SET_CURRENT, null);
