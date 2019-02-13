import path from 'path';
import { ArchiveManager, ArchiveSource, Credentials } from './buttercup';
import ElectronStorageInterface from './storage';
import { getQueue } from '../../renderer/system/queue';
import './ipc-datasource';
import i18n from '../i18n';

let __sharedManager = null;

export function addArchiveToArchiveManager(masterConfig, masterPassword) {
  const { credentials, datasource, type, path: filePath, isNew } = masterConfig;

  const passwordCredentials = Credentials.fromPassword(masterPassword);
  const sourceCredentials = new Credentials({
    ...credentials,
    type
  });
  sourceCredentials.setValue(
    'datasource',
    JSON.stringify({
      type,
      ...datasource
    })
  );

  const manager = getSharedArchiveManager();

  return Promise.all([
    sourceCredentials.toSecureString(masterPassword),
    passwordCredentials.toSecureString(masterPassword)
  ])
    .then(([sourceCredentialsStr, passwordCredentialsStr]) => {
      const source = new ArchiveSource(
        path.basename(filePath),
        sourceCredentialsStr,
        passwordCredentialsStr
      );
      return manager
        .addSource(source)
        .then(() =>
          unlockArchiveInArchiveManager(
            source.id,
            masterPassword,
            isNew
          ).catch(err =>
            manager.removeSource(source.id).then(() => Promise.reject(err))
          )
        );
    })
    .then(archiveId => {
      saveArchiveManager();
      return archiveId;
    });
}

export function lockArchiveInArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager
    .getSourceForID(archiveId)
    .lock()
    .then(() => archiveId)
    .catch(err => {
      const { message } = err;
      if (message) {
        throw new Error(message);
      }
      throw err;
    });
}

export function removeArchiveFromArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager.removeSource(archiveId);
}

export function unlockArchiveInArchiveManager(
  archiveId,
  masterPassword,
  isNew = false
) {
  const manager = getSharedArchiveManager();
  return manager
    .getSourceForID(archiveId)
    .unlock(masterPassword, isNew)
    .then(() => archiveId)
    .catch(err => {
      const { message } = err;
      if (message) {
        if (message.includes('ENOENT')) {
          throw new Error(i18n.t('error.archive-not-found'));
        } else if (message.includes('Authentication')) {
          throw new Error(i18n.t('error.authentication-failed'));
        }
        throw new Error(message);
      }
      throw err;
    });
}

export function getSharedArchiveManager() {
  if (__sharedManager === null) {
    __sharedManager = new ArchiveManager(new ElectronStorageInterface());
  }
  return __sharedManager;
}

export function getArchive(archiveId) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(archiveId);
  return source.workspace.archive;
}

export function updateArchivePassword(archiveId, newPassword) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(archiveId);
  return getQueue()
    .channel('saves')
    .enqueue(() =>
      source
        .updateArchiveCredentials(newPassword)
        .then(() => manager.dehydrateSource(source))
    );
}

export function updateArchiveColour(archiveId, newColor) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(archiveId);
  source.colour = newColor;
  return saveArchiveManager();
}

export function updateArchiveOrder(archiveId, newOrder) {
  const manager = getSharedArchiveManager();
  manager.reorderSource(archiveId, newOrder);
  return saveArchiveManager();
}

export function saveWorkspace(archiveId) {
  const manager = getSharedArchiveManager();
  const { workspace } = manager.getSourceForID(archiveId);
  getQueue()
    .channel('saves')
    .enqueue(
      () => {
        return workspace
          .localDiffersFromRemote()
          .then(
            differs =>
              differs ? workspace.mergeFromRemote().then(() => true) : false
          )
          .then(shouldSave => (shouldSave ? workspace.save() : null));
      },
      undefined,
      archiveId
    );
}

export function saveArchiveManager() {
  const manager = getSharedArchiveManager();
  return manager.dehydrate();
}

export function getSourceName(sourceID) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(sourceID);

  if (!source) {
    throw new Error(
      `Unable to fetch source information: No source found for ID: ${sourceID}`
    );
  }
  return source.name;
}
