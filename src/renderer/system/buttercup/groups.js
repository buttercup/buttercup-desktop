import { saveWorkspace as save, getArchive } from './archive'; 

/**
 * Return recursive groups JSON structure
 * 
 * @export
 * @returns {Object} JSON structure
 */
export function getGroups() {
  const arch = getArchive();
  return arch.getGroups().map(
    group => group.toObject(Buttercup.ManagedGroup.OutputFlag.Groups)
  );
}

/**
 * Create a new group under a parent group
 * 
 * @export
 * @param {string} parentId
 * @param {string} groupName
 */
export function createGroup(parentId, groupName) {
  const arch = getArchive();
  let group = null;

  if (parentId === null) {
    group = arch;
  } else {
    group = arch.getGroupByID(parentId);
  }

  if (!group) {
    throw new Error('Group has not been found.');
  }
  
  group.createGroup(groupName);
  
  if (groupName.toLowerCase() !== 'untitled') {
    save();
  }
}

/**
 * Delete a group
 * 
 * @export
 * @param {string} groupId
 */
export function deleteGroup(groupId) {
  const arch = getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  } 

  group.delete();
  save();
}

/**
 * Save group title
 * 
 * @export
 * @param {string} groupId
 * @param {string} title
 */
export function saveGroup(groupId, title) {
  const arch = getArchive();
  const group = arch.getGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  } 

  group.setTitle(title);
  save();
}

/**
 * Move group to another parent
 * 
 * @export
 * @param {string} groupId
 * @param {string} parentId
 */
export function moveGroup(groupId, parentId) {
  const arch = getArchive();
  const group = arch.getGroupByID(groupId);
  const parent = arch.getGroupByID(parentId);

  if (!group || !parent) {
    throw new Error('Group has not been found.');
  } 

  group.moveToGroup(parent);
  save();
}
