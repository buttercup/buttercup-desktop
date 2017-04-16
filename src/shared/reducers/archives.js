import { createIdentityReducer } from '../utils/redux';
import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_CURRENT, ARCHIVES_CLEAR } from '../actions/types';

export default function archivesReducer(state = [], action) {
  switch (action.type) {
    case ARCHIVES_ADD:
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    case ARCHIVES_REMOVE: {
      const nextState = {...state};
      delete nextState[action.payload];
      return nextState;
    }
    case ARCHIVES_CLEAR:
      return [];
    default:
      return state;
  }
}

export const currentArchive = createIdentityReducer(
  ARCHIVES_SET_CURRENT,
  null
);
