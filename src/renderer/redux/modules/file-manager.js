import { combineReducers } from 'redux';

import webdavFs from 'webdav-fs';
import anyFs from 'any-fs';

const wfs = webdavFs('https://storage.perry.cx/remote.php/webdav', 'buttercup', 'Q3IahV1SYvSdtE1M18w3');
const afs = anyFs(wfs);

// Constants ->
const SET_CURRENT_PATH = 'buttercup/manager/SET_CURRENT_PATH';
const SET_CONTENTS = 'buttercup/manager/SET_CONTENTS';
const LOADING_STARTED = 'buttercup/manager/LOADING_STARTED';
const LOADING_FINISHED = 'buttercup/manager/LOADING_FINISHED';
const ADD_DIRECTORY = 'buttercup/manager/ADD_DIRECTORY';

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
    case ADD_DIRECTORY:
      return [
        ...state,
        {
          name: 'Untitled',
          type: 'directory',
          size: 0,
          mtime: null
        }
      ];
    default:
      return state;
  }
}

function loading(state = false, action) {
  switch (action.type) {
    case LOADING_STARTED:
      return true;
    case LOADING_FINISHED:
      return false;
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
  dispatch({
    type: LOADING_STARTED
  });

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
    dispatch({
      type: LOADING_FINISHED
    });
  });
};

export const addDirectory = () => ({
  type: ADD_DIRECTORY
});

export default combineReducers({
  contents,
  currentPath,
  loading
});
