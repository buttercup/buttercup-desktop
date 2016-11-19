import { combineReducers } from 'redux';


import webdavFs from 'webdav-fs';
import anyFs from 'any-fs';

const wfs = webdavFs('', 'buttercup', '');
const afs = anyFs(wfs);

// Constants ->
const SET_CURRENT_PATH = 'buttercup/manager/SET_CURRENT_PATH';
const SET_CONTENTS = 'buttercup/manager/SET_CONTENTS';

// Reducers ->
function currentPath(state = '', action) {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return action.payload;
    default:
      return state;
  }
}

function contents(state = [], action) {
  switch (action.type) {
    case SET_CONTENTS:
      return action.payload;
    default:
      return state;
  }
}

// Action Creators ->

export const setCurrentPath = path => ({
  type: SET_CURRENT_PATH,
  payload: path
});

export const setContents = contents => ({
  type: SET_CONTENTS,
  payload: contents
});

export const navigate = path => dispatch => {
  dispatch(setCurrentPath(path));

  afs.readDirectory(path).then(result => {
    const files = result.map(item => ({
      name: item.name,
      type: item.isFile() ? 'file' : 'directory',
      size: item.size,
      mtime: item.mtime
    }));

    if (path !== '/') {
      files.unshift({name: '..', type: 'directory', size: 0, mtime: null});
    }

    dispatch(setContents(files));
  });
};

export default combineReducers({
  contents,
  currentPath
});
