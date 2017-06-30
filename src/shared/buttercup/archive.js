import path from 'path';
import { ArchiveManager, createCredentials } from 'buttercup-web';
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

export function unlockArchiveInArchiveManager(archiveId, masterPassword) {
  const manager = getSharedArchiveManager();
  return manager.unlock(archiveId, masterPassword);
}

export function getSharedArchiveManager() {
  if (__sharedManager === null) {
    __sharedManager = new ArchiveManager(new ElectronStorageInterface());
  }
  return __sharedManager;
}

export function getArchive(archiveId) {
  const manager = getSharedArchiveManager();
  const sourceIndex = manager.indexOfSource(archiveId);
  const source = manager.sources[sourceIndex];
  return source.workspace.primary.archive;
}

export function saveWorkspace(archiveId) {
  const manager = getSharedArchiveManager();
  const sourceIndex = manager.indexOfSource(archiveId);
  const { workspace } = manager.sources[sourceIndex];

  return workspace
    .localDiffersFromRemote()
    .then(differs => differs
      ? workspace.mergeSaveablesFromRemote().then(() => true)
      : false
    )
    .then(shouldSave => shouldSave
      ? workspace.save()
      : null
    );
}
