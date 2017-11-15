import { saveWorkspace, getArchive } from './archive';
import i18n from '../i18n';

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

/**
 * Filter empty values
 * @param {ButtercupEntry} entry
 */
export function filterEmptyEntryValues(entry) {
  if (entry.meta) {
    entry.meta = entry.meta.filter(value => Object.keys(value).length !== 0);
  }

  return entry;
}

/**
 * Validate buttercup entry values
 * @param {ButtercupEntry} entry
 */
export function validateEntry(entry) {
  const errorMessages = [];
  // filter empty values
  entry = filterEmptyEntryValues(entry);

  if (!entry.properties) {
    errorMessages.push(
      i18n.formatMessage({
        id: 'entry-inputs-empty-info',
        defaultMessage: 'Please enter at least a title.'
      })
    );
  } else {
    if (!entry.properties.title) {
      errorMessages.push(
        i18n.formatMessage({
          id: 'entry-title-empty-info',
          defaultMessage: 'Please enter a title.'
        })
      );
    }
  }

  return errorMessages.length === 0
    ? Promise.resolve(entry)
    : Promise.reject(errorMessages.join('\n'));
}

export function loadEntries(archiveId, groupId) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(
      i18n.formatMessage({
        id: 'group-not-found-error',
        defaultMessage: 'Group has not been found'
      })
    );
  }

  return group.getEntries().map(entry => entryToObj(entry));
}

export function updateEntry(archiveId, entryObj) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryObj.id);

  if (!entry) {
    throw new Error(
      i18n.formatMessage({
        id: 'entry-not-found-error',
        defaultMessage: 'Entry has not been found'
      })
    );
  }

  return new Promise((resolve, reject) => {
    // validate entry
    validateEntry(entryObj)
      .then(entryData => {
        const properties = entryData.properties || {};
        const meta = entryData.meta || [];
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

        resolve(entryToObj(entry));
      })
      .catch(err => reject(err));
  });
}

export function createEntry(archiveId, groupId, newValues) {
  const arch = getArchive(archiveId);
  const group = arch.findGroupByID(groupId);

  if (!group) {
    throw new Error(
      i18n.formatMessage({
        id: 'group-not-found-error',
        defaultMessage: 'Group has not been found'
      })
    );
  }

  return new Promise((resolve, reject) => {
    // validate entry
    validateEntry(newValues)
      .then(entryData => {
        const entry = group.createEntry(entryData.properties.title);

        ['username', 'password'].forEach(key => {
          if (typeof entryData.properties[key] !== 'undefined') {
            entry.setProperty(key, entryData.properties[key]);
          }
        });

        (entryData.meta || []).forEach(meta => {
          entry.setMeta(meta.key, meta.value);
        });

        saveWorkspace(archiveId);

        resolve(entryToObj(entry));
      })
      .catch(err => reject(err));
  });
}

export function deleteEntry(archiveId, entryId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);

  if (!entry) {
    throw new Error(
      i18n.formatMessage({
        id: 'entry-not-found-error',
        defaultMessage: 'Entry has not been found'
      })
    );
  }

  entry.delete();
  saveWorkspace(archiveId);
}

export function moveEntry(archiveId, entryId, groupId) {
  const arch = getArchive(archiveId);
  const entry = arch.getEntryByID(entryId);
  const group = arch.findGroupByID(groupId);

  if (!entry || !group) {
    throw new Error(
      i18n.formatMessage({
        id: 'entry-not-found-error',
        defaultMessage: 'Entry has not been found'
      })
    );
  }

  entry.moveToGroup(group);
  saveWorkspace(archiveId);
}
