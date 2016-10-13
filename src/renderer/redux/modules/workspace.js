export const SET_WORKSPACE = 'buttercup/workspace/SET';

export default function workspaceReducer(state = null, action) {
  switch (action.type) {
    case SET_WORKSPACE: 
      return action.payload;
    default:
      return state;
  }
}

export const setWorkspace = workspace => ({ type: SET_WORKSPACE, payload: workspace });
