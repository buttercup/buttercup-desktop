import { combineReducers } from 'redux';
import recentFiles from './modules/recentFiles';

const rootReducer = combineReducers({
  recentFiles
});

export default rootReducer;
