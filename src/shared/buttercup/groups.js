import { Group } from 'buttercup/dist/buttercup-web.min';
import { getArchive, saveWorkspace } from './archive';
import { normalize, denormalize, schema } from 'normalizr';
import i18n from '../i18n';

const group = new schema.Entity('groups');
const groups = new schema.Array(group);
group.define({ groups });

export function normalizeGroups(payload) {
  return normalize(payload, groups);
}

export function denormalizeGroups(shownIds, allIds) {
  return denormalize(shownIds, groups, { groups: allIds });
}

export function groupToObject(group) {
  const obj = group.toObject();
  return {
    ...obj,
    isTrash: group.isTrash(),
    groups: obj.groups.map(g => g.id)
  };
}

export function findParentId(groups, groupId) {
  return Object.keys(groups).find(parentId => {
    const group = groups[parentId];
    if (group.groups && group.groups.indexOf(groupId) !== -1) {
      return true;
    }
    return false;
  });
}

export function getGroups(archiveId) {
  const arch = getArchive(archiveId);
  return arch.getGroups().map(group =>
    Object.assign(group.toObject(Group.OutputFlag.Groups), {
      isTrash: group.isTrash()
    })
  );
}

export function createGroup(archiveId, parentId, groupName) {
  const arch = getArchive(archiveId);
  const group = parentId ? arch.findGroupByID(parentId) : arch;

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  const newGroup = group.createGroup(groupName);

  if (groupName.toLowerCase() !== 'untitled') {
    saveWorkspace(archiveId);
  }

  return groupToObject(newGroup);
}

export function deleteGroup(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  group.delete();
  saveWorkspace(archiveId);
}

export function saveGroup(archiveId, groupId, title) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  group.setTitle(title);
  saveWorkspace(archiveId);

  return groupToObject(group);
}

export function moveGroup(archiveId, groupId, parentId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);
  const parent = parentId ? arch.findGroupByID(parentId) : arch;

  if (!group || !parent) {
    throw new Error(i18n.t('error.group-not-found'));
  }

  group.moveToGroup(parent);
  saveWorkspace(archiveId);
}

export function isGroupInTrash(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);
  return group.isInTrash();
}

export function emptyTrash(archiveId) {
  const arch = getArchive(archiveId);
  arch.emptyTrash();
  saveWorkspace(archiveId);
}
