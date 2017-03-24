import { combineReducers } from 'redux';
import { ARCHIVES_ADD, ARCHIVES_REMOVE, ARCHIVES_SET_CURRENT } from '../actions/types';

function archivesReducer(state = [], action) {
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
    default:
      return state;
  }
}

function currentArchive(state = null, action) {
  switch (action.type) {
    case ARCHIVES_SET_CURRENT: 
      return action.payload;
    default:
      return state;
  }
}

export default combineReducers({
  byId: archivesReducer,
  currentArchive
});
