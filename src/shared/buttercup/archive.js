import path from 'path';
import {
  ArchiveManager as OldArchiveManager,
  createCredentials
} from 'buttercup/dist/buttercup-web.min';
import ElectronStorageInterface from './storage';
import { enqueueInMain as enqueue } from '../../renderer/system/queue';
import './ipc-datasource';
import i18n from '../i18n';

const { ArchiveManager, ArchiveSource } = OldArchiveManager.v2;
let __sharedManager = null;

export async function addArchiveToArchiveManager(masterConfig, masterPassword) {
  const { credentials, datasource, type, path: filePath, isNew } = masterConfig;

  const passwordCredentials = createCredentials.fromPassword(masterPassword);
  const sourceCredentials = createCredentials(type, credentials);
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
      manager.addSource(source);
      return unlockArchiveInArchiveManager(source.id, masterPassword, isNew);
    })
    .then(archiveId => {
      saveArchiveManager();
      return archiveId;
    });
}

export function lockArchiveInArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager
    .lock(archiveId)
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
  return source.workspace.primary.archive;
}

export function updateArchivePassword(archiveId, newPassword) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(archiveId);

  enqueue('saves', () => {
    return source.updateArchiveCredentials(newPassword);
  });
}

export function updateArchiveColour(archiveId, newColor) {
  const manager = getSharedArchiveManager();
  const source = manager.getSourceForID(archiveId);
  source.colour = newColor;
  saveArchiveManager();
}

export function updateArchiveOrder(archiveId, newOrder) {
  const manager = getSharedArchiveManager();
  console.log(archiveId, newOrder);
  manager.reorderSource(archiveId, newOrder);
  saveArchiveManager();
}

export function saveWorkspace(archiveId) {
  const manager = getSharedArchiveManager();
  const { workspace } = manager.getSourceForID(archiveId);

  enqueue('saves', () => {
    return workspace
      .localDiffersFromRemote()
      .then(
        differs =>
          differs
            ? workspace.mergeSaveablesFromRemote().then(() => true)
            : false
      )
      .then(shouldSave => (shouldSave ? workspace.save() : null));
  });
}

export function saveArchiveManager() {
  const manager = getSharedArchiveManager();
  manager.dehydrate().then(res => {
    console.log('saved', res);
  });
}
