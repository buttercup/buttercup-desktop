import { ipcRenderer as ipc } from 'electron';
import { getSharedArchiveManager } from './archive';
import {
  addArchiveToStore,
  removeArchiveFromStore,
  lockArchiveInStore,
  unlockArchiveInStore
} from '../actions/archives.js';

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  archiveManager.on('sourceAdded', function __handleNewSource(sourceInfo) {
    store.dispatch(addArchiveToStore(sourceInfo));
    ipc.send('archive-list-updated');
  });

  archiveManager.on('sourceRehydrated', function __handleRehydratedSource(
    sourceInfo
  ) {
    store.dispatch(lockArchiveInStore(sourceInfo.id));
    ipc.send('archive-list-updated');
  });

  archiveManager.on('sourceUnlocked', function __handleUnlockedSource(
    sourceInfo
  ) {
    store.dispatch(unlockArchiveInStore(sourceInfo.id));
  });

  archiveManager.on('sourceRemoved', function __handleRemovedSource(
    sourceInfo
  ) {
    store.dispatch(removeArchiveFromStore(sourceInfo.id));
    ipc.send('archive-list-updated');
  });

  // rehydrate
  archiveManager.rehydrate();
}
