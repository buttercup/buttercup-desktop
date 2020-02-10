import ms from 'ms';
import { ipcRenderer as ipc } from 'electron';
import { subscribe } from 'redux-subscriber';
import { lockArchive } from '../../shared/actions/archives';
import {
  getSetting,
  getUIState,
  getCurrentEntryMode
} from '../../shared/selectors';

const __cache = {
  timer: null
};

export const setupArchiveActions = store => {
  ipc.on('lock-all-archives', lockAllArchives);

  // store subscriptions
  subscribe('settings.isButtercupFocused', lockArchiveTimer);
  subscribe('entries.mode', lockArchiveTimer);
  subscribe('uiState.isRenaming', lockArchiveTimer);
  subscribe('archives', lockArchiveTimer);

  function getStateData() {
    const state = store.getState();

    // flag for checking whether an action is in progress
    const isPerformingAnAction =
      getUIState(state, 'savingArchive') ||
      getUIState(state, 'isRenaming') ||
      getCurrentEntryMode(state) !== 'view';

    const archives = state.archives;

    return {
      isPerformingAnAction,
      archives,
      areSomeArchivesUnlocked: archives.some(
        archive => archive.status === 'unlocked'
      ),
      autolockSeconds: getSetting(state, 'autolockSeconds'),
      lockArchiveOnFocusout: getSetting(state, 'lockArchiveOnFocusout'),
      isButtercupFocused: getSetting(state, 'isButtercupFocused')
    };
  }

  function lockAllArchives() {
    const { archives, isPerformingAnAction } = getStateData();

    if (archives.length && !isPerformingAnAction) {
      archives.forEach(({ id, status }) =>
        status === 'unlocked' ? store.dispatch(lockArchive(id)) : ''
      );
    }
  }

  function lockArchiveTimer() {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }

    const {
      areSomeArchivesUnlocked,
      isPerformingAnAction,
      autolockSeconds,
      lockArchiveOnFocusout,
      isButtercupFocused
    } = getStateData();

    if (
      areSomeArchivesUnlocked &&
      !isPerformingAnAction &&
      // when buttercup is not focused, no seconds set and lock on unfocus is off
      ((!autolockSeconds && lockArchiveOnFocusout && !isButtercupFocused) ||
        // when seconds set and buttercup is not focused and lock on unfocus is on or
        // lock on unfocus is off
        (autolockSeconds > 0 &&
          ((lockArchiveOnFocusout && !isButtercupFocused) ||
            !lockArchiveOnFocusout)))
    ) {
      __cache.timer = setTimeout(
        () => lockAllArchives(),
        ms(autolockSeconds + 's')
      );
    }
  }
};
