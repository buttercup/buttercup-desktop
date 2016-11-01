import { saveWorkspace as save, getArchive } from './archive';

function entryToObj(entry) {
  const obj = entry.toObject();
  return Object.assign(
    obj,
    {
      meta: Object.keys(obj.meta).map(metaKey => ({
        key: metaKey,
        value: obj.meta[metaKey]
      }))
    }
  );
}

export function loadEntries(groupId) {
  const arch = getArchive();
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error('Group has not been found.');
  }

  return group.getEntries().map(entry => entryToObj(entry));
}

export function updateEntry(entryObj) {
  const arch = getArchive();
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
    if (sourceMeta.hasOwnProperty(metaKey)) { // eslint-disable-line no-prototype-builtins
      const keys = meta.map(metaObj => metaObj.key);
      if (keys.indexOf(metaKey) === -1) {
        entry.deleteMeta(metaKey);
      }
    }
  }

  // Update/Add meta
  meta.forEach(metaObj => {
    const source = entry.getMeta(metaObj.key);
    if (source === undefined || (source !== undefined && source !== metaObj.value)) {
      entry.setMeta(metaObj.key, metaObj.value);
    }
  });

  // Save workspace
  save();
}

export function createEntry(newValues, groupId) {
  const arch = getArchive();
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

  save();

  return Promise.resolve(entryToObj(entry));
}

export function deleteEntry(entryId) {
  const arch = getArchive();
  const entry = arch.getEntryByID(entryId);

  if (!entry) {
    throw new Error('Entry has not been found');
  }

  entry.delete();
  save();
}

export function moveEntry(entryId, groupId) {
  const arch = getArchive();
  const entry = arch.getEntryByID(entryId);
  const group = arch.findGroupByID(groupId);

  if (!entry || !group) {
    throw new Error('Entry has not been found');
  }

  entry.moveToGroup(group);
  save();
}
