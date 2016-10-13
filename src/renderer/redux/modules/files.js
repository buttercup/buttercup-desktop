import { newWorkspace, loadWorkspace } from '../../system/buttercup/archive';
import { addRecent } from './recents';
import { resetGroups } from './groups';

// Constants ->

export const OPEN = 'buttercup/files/OPEN';
export const NEW = 'buttercup/files/NEW';

// Action Creators ->

export function createNewFile(filename) {
  return dispatch => {
    return newWorkspace(filename, 'sallar').then(() => {
      dispatch(addRecent(filename));
    });
  };
}

export function openFile(filename) {
  return dispatch => {
    return loadWorkspace(filename, 'sallar').then(workspace => {
      const arch = workspace.getArchive();
      const groupToObject = function(groups) {
        return groups.map(group => {
          const obj = group.toObject();
          const sub = group.getGroups();
          obj.children = [];
          if (sub.length > 0) {
            obj.children = groupToObject(sub);
          }
          obj.name = obj.title;
          return obj;
        });
      };
      const res = groupToObject(arch.getGroups());
      dispatch(resetGroups(res));
    });
  };
}
