import path from 'path';
import { getQueue } from '../../renderer/system/queue';
import i18n from '../i18n';
import { Credentials, VaultManager, VaultSource } from './buttercup';
import './googledrive-datasource';
import './ipc-datasource';
import ElectronStorageInterface from './storage';

let __sharedManager = null;

export async function addArchiveToVaultManager(masterConfig, masterPassword) {
  const { datasource, type, path: filePath, isNew } = masterConfig;

  const manager = getSharedVaultManager();
  const sourceCredentials = Credentials.fromDatasource(
    datasource,
    masterPassword
  );
  const credentialString = await sourceCredentials.toSecureString();

  const source = new VaultSource(
    path.basename(filePath),
    type,
    credentialString
  );
  await manager.addSource(source);
  return unlockArchiveInVaultManager(source.id, masterPassword, isNew)
    .catch(err =>
      manager.removeSource(source.id).then(() => Promise.reject(err))
    )
    .then(vaultId => {
      saveVaultManager();
      return vaultId;
    });
}

export function lockArchiveInVaultManager(archiveId) {
  const manager = getSharedVaultManager();
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

export function removeArchiveFromVaultManager(archiveId) {
  const manager = getSharedVaultManager();
  return manager.removeSource(archiveId);
}

export function unlockArchiveInVaultManager(
  archiveId,
  masterPassword,
  isNew = false
) {
  const manager = getSharedVaultManager();
  return manager
    .getSourceForID(archiveId)
    .unlock(Credentials.fromPassword(masterPassword), {
      initialiseRemote: isNew
    })
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

export function getSharedVaultManager() {
  if (__sharedManager === null) {
    __sharedManager = new VaultManager({
      sourceStorage: new ElectronStorageInterface('archives'),
      cacheStorage: new ElectronStorageInterface('archives-cache')
    });
  }
  return __sharedManager;
}

export function getArchive(archiveId) {
  const manager = getSharedVaultManager();
  const source = manager.getSourceForID(archiveId);
  return source.vault;
}

export function updateArchivePassword(archiveId, newPassword) {
  const manager = getSharedVaultManager();
  const source = manager.getSourceForID(archiveId);
  return getQueue()
    .channel('saves')
    .enqueue(() =>
      source
        .changeMasterPassword(newPassword)
        .then(() => manager.dehydrateSource(source))
    );
}

export function updateArchiveColour(archiveId, newColor) {
  const manager = getSharedVaultManager();
  const source = manager.getSourceForID(archiveId);
  source.colour = newColor;
  return saveVaultManager();
}

export function updateArchiveOrder(archiveId, newOrder) {
  const manager = getSharedVaultManager();
  manager.reorderSource(archiveId, newOrder);
  return saveVaultManager();
}

export function saveWorkspace(archiveId) {
  const manager = getSharedVaultManager();
  const source = manager.getSourceForID(archiveId);
  getQueue()
    .channel('saves')
    .enqueue(() => source.save(), undefined, archiveId);
}

export function saveVaultManager() {
  const manager = getSharedVaultManager();
  return manager.dehydrate();
}

export function getSourceName(sourceID) {
  const manager = getSharedVaultManager();
  const source = manager.getSourceForID(sourceID);

  if (!source) {
    throw new Error(
      `Unable to fetch source information: No source found for ID: ${sourceID}`
    );
  }
  return source.name;
}
