import { ipcRenderer as ipc } from 'electron';
import { getSharedArchiveManager } from './archive';
import {
  addArchiveToStore,
  removeArchiveFromStore,
  lockArchiveInStore,
  unlockArchiveInStore,
} from '../actions/archives.js';
import { getAllArchives, getCurrentArchiveId } from '../selectors';

export function updateApplicationMenu(state) {
  ipc.send('archive-list-updated', {
    archives: getAllArchives(state),
    currentArchiveId: getCurrentArchiveId(state)
  });
};

export function linkArchiveManagerToStore(store) {
  const archiveManager = getSharedArchiveManager();

  // attach listeners
  archiveManager.on('sourceAdded', function __handleNewSource(sourceInfo) {
    store.dispatch(addArchiveToStore(sourceInfo));
    updateApplicationMenu(store.getState());
  });
  archiveManager.on('sourceRehydrated', function __handleRehydratedSource(sourceInfo) {
    store.dispatch(lockArchiveInStore(sourceInfo.id));
    updateApplicationMenu(store.getState());
  });
  archiveManager.on('sourceUnlocked', function __handleUnlockedSource(sourceInfo) {
    store.dispatch(unlockArchiveInStore(sourceInfo.id));
  });
  archiveManager.on('sourceRemoved', function __handleRemovedSource(sourceInfo) {
    store.dispatch(removeArchiveFromStore(sourceInfo.id));
    updateApplicationMenu(store.getState());
  });

  // rehydrate
  archiveManager.rehydrate();
}
