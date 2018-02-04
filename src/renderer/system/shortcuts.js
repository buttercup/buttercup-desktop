import Mousetrap from 'mousetrap';
import ms from 'ms';
import { lockArchive } from '../../shared/actions/archives';
import { getCurrentArchiveId, getCurrentEntry } from '../../shared/selectors';
import { copyToClipboard, readClipboard } from './utils';
const __cache = {
  timer: null
};

export const setupShortcuts = store => {
  /**
   * Copy password to clipboard
   */
  Mousetrap.bind('mod+c', () => {
    if (__cache.timer) {
      clearTimeout(__cache.timer);
    }

    const selection = window.getSelection().toString();
    const currentEntry = getCurrentEntry(store.getState());

    if (!selection && currentEntry) {
      const { password } = currentEntry.properties;
      copyToClipboard(password);

      // Clean the clipboard after 15s
      // @TODO: Make a UI for this.
      __cache.timer = setTimeout(function clipboardPurgerClosure() {
        if (readClipboard() === password) {
          copyToClipboard('');
        }
      }, ms('15s'));
    }
  });

  /**
   * Copy username to clipboard
   */
  Mousetrap.bind('mod+b', () => {
    const currentEntry = getCurrentEntry(store.getState());
    if (currentEntry) {
      copyToClipboard(currentEntry.properties.username);
    }
  });

  /**
   * Lock Current Archive 
   */
  Mousetrap.bind('mod+l', () => {
    const currentArchiveId = getCurrentArchiveId(store.getState());
    if (currentArchiveId) {
      store.dispatch(lockArchive(currentArchiveId));
    }
  });
};
