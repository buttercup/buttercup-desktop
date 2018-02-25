import { UI_STATE_SET } from '../actions/types';

const initialState = {
  savingArchive: false,
  isArchiveSearchVisible: false
};

export default function uiState(state = initialState, action) {
  switch (action.type) {
    case UI_STATE_SET:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    default:
      return state;
  }
}
