import path from 'path';
import { combineReducers } from 'redux';

import webdavFs from 'webdav-fs';
import anyFs from 'any-fs';

const wfs = webdavFs('', 'buttercup', '');
const afs = anyFs(wfs);

// Constants ->
const SET_CURRENT_PATH = 'buttercup/manager/SET_CURRENT_PATH';
const SET_CONTENTS = 'buttercup/manager/SET_CONTENTS';
const LOADING_STARTED = 'buttercup/manager/LOADING_STARTED';
const LOADING_FINISHED = 'buttercup/manager/LOADING_FINISHED';
const ADD_DIRECTORY = 'buttercup/manager/ADD_DIRECTORY';
const SELECT_FILE_INDEX = 'buttercup/manager/SELECT_FILE_INDEX';

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

function selectedIndex(state = null, action) {
  switch (action.type) {
    case SELECT_FILE_INDEX:
      return action.payload;
    case SET_CURRENT_PATH:
      return null;
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

export const navigate = index => (dispatch, getState) => {
  let pathToNavigate = '/';

  if (index !== null) {
    const state = getState().manager;
    pathToNavigate = path.resolve(state.currentPath, state.contents[index].name);
  }

  dispatch(setCurrentPath(pathToNavigate));
  dispatch({
    type: LOADING_STARTED
  });

  afs.readDirectory(pathToNavigate).then(result => {
    const files = result.map(item => ({
      name: item.name,
      type: item.isFile() ? 'file' : 'directory',
      size: item.size,
      mtime: item.mtime
    }));

    if (pathToNavigate !== '/') {
      files.unshift({ name: '..', type: 'directory', size: 0, mtime: null });
    }

    dispatch(setContents(files));
    dispatch({
      type: LOADING_FINISHED
    });
  });
};

export const setSelectedIndex = index => ({
  type: SELECT_FILE_INDEX,
  payload: index
});

export const addDirectory = () => ({
  type: ADD_DIRECTORY
});

export const getSelectedPath = state =>
  state.selectedIndex === null ? null : state.contents[state.selectedIndex];

export default combineReducers({
  contents,
  currentPath,
  selectedIndex,
  loading
});
