import { arrayMove } from 'react-sortable-hoc';
import { createIdentityReducer } from '../utils/redux';
import {
  ARCHIVES_SET,
  ARCHIVES_SET_CURRENT,
  ARCHIVES_SET_ORDER
} from '../actions/types';

export default function archivesReducer(state = [], action) {
  switch (action.type) {
    case ARCHIVES_SET:
      return action.payload;
    case ARCHIVES_SET_ORDER:
      const { archiveId, order } = action.payload;
      const oldIndex = state.findIndex(archive => archive.id === archiveId);
      return arrayMove(state, oldIndex, order).map((archive, i) => ({
        ...archive,
        order: i
      }));
    default:
      return state;
  }
}

export const currentArchive = createIdentityReducer(ARCHIVES_SET_CURRENT, null);
