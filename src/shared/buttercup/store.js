import { getSharedArchiveManager } from './archive';
import {
  addArchiveToStore,
  removeArchiveFromStore,
  unlockArchiveInStore,
} from '../actions/archives.js';

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  // attach listeners
  archiveManager.on('sourceAdded', function __handleNewSource(sourceInfo) {
    store.dispatch(addArchiveToStore(sourceInfo));
  });
  archiveManager.on('sourceRehydrated', function __handleRehydratedSource(sourceInfo) {
    store.dispatch(addArchiveToStore(sourceInfo));
  });
  archiveManager.on('sourceUnlocked', function __handleUnlockedSource(sourceInfo) {
    store.dispatch(unlockArchiveInStore(sourceInfo.id));
  });
  archiveManager.on('sourceRemoved', function __handleRemovedSource(sourceInfo) {
    store.dispatch(removeArchiveFromStore(sourceInfo.id));
  });

  // rehydrate
  archiveManager.rehydrate();
}
