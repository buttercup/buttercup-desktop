import { saveWorkspace, getArchive } from './archive';

function entryToObj(entry) {
  const obj = entry.toObject();
  return {
    ...obj,
    isInTrash: entry.isInTrash(),
    meta: Object.keys(obj.meta).map(metaKey => ({
      key: metaKey,
      value: obj.meta[metaKey]
    }))
  };
}

export function loadEntries(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  return group.getEntries().map(entry => entryToObj(entry));
}

export function updateEntry(archiveId, entryObj) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryObj.id);

  if (!entry) {
    throw new Error('Entry has not been found');
  }

  const properties = entryObj.properties || {};
  const meta = entryObj.meta || [];
  const sourceMeta = entry.toObject().meta || {};

  // Update properties
  for (const propertyKey in properties) {
    if (
      properties.hasOwnProperty(propertyKey) && // eslint-disable-line no-prototype-builtins
      entry.getProperty(propertyKey) !== properties[propertyKey]
    ) {
      entry.setProperty(propertyKey, properties[propertyKey]);
    }
  }

  // Remove Meta
  for (const metaKey in sourceMeta) {
    if (sourceMeta.hasOwnProperty(metaKey)) {
      // eslint-disable-line no-prototype-builtins
      const keys = meta.map(metaObj => metaObj.key);
      if (keys.indexOf(metaKey) === -1) {
        entry.deleteMeta(metaKey);
      }
    }
  }

  // Update/Add meta
  meta.forEach(metaObj => {
    const source = entry.getMeta(metaObj.key);
    if (
      source === undefined ||
      (source !== undefined && source !== metaObj.value)
    ) {
      entry.setMeta(metaObj.key, metaObj.value);
    }
  });

  // Save workspace
  saveWorkspace(archiveId);
}

export function createEntry(archiveId, groupId, newValues) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  const entry = group.createEntry(newValues.properties.title);

  ['username', 'password'].forEach(key => {
    if (typeof newValues.properties[key] !== 'undefined') {
      entry.setProperty(key, newValues.properties[key]);
    }
  });

  (newValues.meta || []).forEach(meta => {
    entry.setMeta(meta.key, meta.value);
  });

  saveWorkspace(archiveId);

  return Promise.resolve(entryToObj(entry));
}

export function deleteEntry(archiveId, entryId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);

  if (!entry) {
    throw new Error('Entry has not been found');
  }

  entry.delete();
  saveWorkspace(archiveId);
}

export function moveEntry(archiveId, entryId, groupId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);
  const group = arch.findGroupByID(groupId);

  if (!entry || !group) {
    throw new Error('Entry has not been found');
  }

  entry.moveToGroup(group);
  saveWorkspace(archiveId);
}
