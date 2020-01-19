import ms from 'ms';
import { lockArchive } from '../../shared/actions/archives';
import { getAllArchives } from '../../shared/selectors';

const __cache = {
  timer: null
};

export const setupArchiveActions = store => ({
  lockAllArchives() {
    const state = store.getState();

    const { savingArchive } = state.uiState;
    const archives = getAllArchives(state);

    if (!savingArchive && archives) {
      archives.forEach(({ id, status }) =>
        status === 'unlocked' ? store.dispatch(lockArchive(id)) : ''
      );
    }
  },
  lockArchiveTimer() {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }
    const state = store.getState();

    const {
      uiState: { savingArchive },
      settings: { autolockSeconds, lockArchiveOnFocusout, isButtercupFocused }
    } = state.settings;

    if (
      !savingArchive &&
      // when buttercup is not focused, no seconds set and lock on unfocus is off
      ((autolockSeconds === '0' &&
        lockArchiveOnFocusout &&
        !isButtercupFocused) ||
        // when seconds set and buttercup is not focused and lock on unfocus is on or
        // lock on unfocus is off
        (autolockSeconds !== '0' &&
          ((lockArchiveOnFocusout && !isButtercupFocused) ||
            !lockArchiveOnFocusout)))
    ) {
      __cache.timer = setTimeout(() => {
        this.lockAllArchives();
      }, ms(autolockSeconds + 's'));
    }
  }
});
