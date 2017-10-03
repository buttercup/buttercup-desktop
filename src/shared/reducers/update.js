import { UPDATE_AVAILABLE, UPDATE_INSTALL } from '../actions/types';

const initialState = {
  available: false,
  version: null,
  notes: null
};

export default function update(state = initialState, action) {
  switch (action.type) {
    case UPDATE_AVAILABLE:
      return {
        ...state,
        available: true,
        version: action.payload.releaseName,
        notes: action.payload.releaseNotes
      };
    case UPDATE_INSTALL:
      return {
        ...state,
        available: false,
        version: null,
        notes: null
      };
    default:
      return state;
  }
}
