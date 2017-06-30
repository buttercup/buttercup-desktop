import { Group } from 'buttercup-web';
import { getArchive, saveWorkspace } from './archive';

export function getGroups(archiveId) {
  const arch = getArchive(archiveId);
  return arch.getGroups().map(
    group => Object.assign(group.toObject(Group.OutputFlag.Groups), {
      isTrash: group.isTrash()
    })
  );
}

export function createGroup(archiveId, parentId, groupName) {
  const arch = getArchive(archiveId);
  let group = null;

  if (parentId === null) {
    group = arch;
  } else {
    group = arch.findGroupByID(parentId);
  }

  if (!group) {
    throw new Error('Group has not been found.');
  }

  group.createGroup(groupName);

  if (groupName.toLowerCase() !== 'untitled') {
    saveWorkspace(archiveId);
  }
}

export function deleteGroup(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  group.delete();
  saveWorkspace(archiveId);
}

export function saveGroup(archiveId, groupId, title) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  group.setTitle(title);
  saveWorkspace(archiveId);
}

export function moveGroup(archiveId, groupId, parentId, dropToGap = false) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);
  let parent = parentId ? arch.findGroupByID(parentId) : arch;

  if (dropToGap) {
    parent = findParentGroup(parentId, arch);
  }

  if (!group || !parent) {
    throw new Error('Group has not been found.');
  }

  group.moveToGroup(parent);
  saveWorkspace(archiveId);
}

export function emptyTrash(archiveId) {
  const arch = getArchive(archiveId);
  arch.emptyTrash();
  saveWorkspace(archiveId);
}

function findParentGroup(groupId, group) {
  const groups = group.getGroups();
  for (const subGroup of groups) {
    if (subGroup.getID() === groupId) {
      return group;
    }
    const findInChildren = findParentGroup(groupId, subGroup);
    if (findInChildren !== false) {
      return findInChildren;
    }
  }
  return false;
}
