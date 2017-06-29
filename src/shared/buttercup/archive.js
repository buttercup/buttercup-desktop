import path from 'path';
import {
  ArchiveManager,
  createCredentials
} from 'buttercup-web';
import ElectronStorageInterface from './storage';
import './ipc-datasource';

let __sharedManager = null;

export function addArchiveToArchiveManager(masterConfig, masterPassword) {
  const { credentials, datasource, type, path: filePath, isNew } = masterConfig;

  const passwordCredentials = createCredentials.fromPassword(masterPassword);
  const sourceCredentials = createCredentials(type, credentials);
  sourceCredentials.setValue('datasource', JSON.stringify({
    type,
    ...datasource
  }));

  const manager = getSharedArchiveManager();

  return manager.addSource(
    path.basename(filePath),
    sourceCredentials,
    passwordCredentials,
    isNew
  );
}

export function removeArchiveFromArchiveManager(archiveId) {
  const manager = getSharedArchiveManager();
  return manager.remove(archiveId);
}

export function unlockArchive(archiveId, masterPassword) {
  const manager = getSharedArchiveManager();
  return manager.unlock(archiveId, masterPassword);
}

export function getSharedArchiveManager() {
  if (__sharedManager === null) {
    __sharedManager = new ArchiveManager(new ElectronStorageInterface());
  }
  return __sharedManager;
}
