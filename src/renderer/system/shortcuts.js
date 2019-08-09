import Mousetrap from 'mousetrap';
import { lockArchive } from '../../shared/actions/archives';
import { getCurrentArchiveId, getCurrentEntry } from '../../shared/selectors';
import { copyToClipboard } from './utils';
import { getFacadeFieldValue } from '../../shared/buttercup/entries';

export const setupShortcuts = store => {
  /**
   * Copy password to clipboard
   */
  Mousetrap.bind('mod+c', () => {
    const selection = window.getSelection().toString();
    const currentEntry = getCurrentEntry(store.getState());

    if (!selection && currentEntry) {
      const password = getFacadeFieldValue(currentEntry, 'password');

      if (!password) {
        return;
      }

      copyToClipboard(password, true);
    }
  });

  /**
   * Copy username to clipboard
   */
  Mousetrap.bind('mod+b', () => {
    const currentEntry = getCurrentEntry(store.getState());
    if (currentEntry) {
      const username = getFacadeFieldValue(currentEntry, 'username');

      if (username) {
        copyToClipboard(username);
      }
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
