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
    console.log('Source added', sourceInfo);
    store.dispatch(addArchiveToStore(sourceInfo));
  });
  archiveManager.on('sourceRehydrated', function __handleRehydratedSource(sourceInfo) {
    console.log('Source rehydrated', sourceInfo);
    store.dispatch(addArchiveToStore(sourceInfo));
  });
  archiveManager.on('sourceUnlocked', function __handleUnlockedSource(sourceInfo) {
    console.log('Source unlocked', sourceInfo);
    store.dispatch(unlockArchiveInStore(sourceInfo.id));
  });
  archiveManager.on('sourceRemoved', function __handleRemovedSource(sourceInfo) {
    console.log('Source removed', sourceInfo);
    store.dispatch(removeArchiveFromStore(sourceInfo.id));
  });

  // rehydrate
  archiveManager.rehydrate();
}
