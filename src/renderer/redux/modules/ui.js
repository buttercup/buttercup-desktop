import Immutable from 'seamless-immutable';
import { SET_WORKSPACE } from './workspace';

const initial = Immutable({
  archiveOpen: false
});

export default function uiReducer(state = initial, action) {
  switch (action.type) {
    case SET_WORKSPACE:
      return state.set('archiveOpen', true);
    default:
      return state;
  }
}
