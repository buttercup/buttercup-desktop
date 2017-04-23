import Mousetrap from 'mousetrap';
import { getCurrentEntry } from '../../shared/selectors';
import { copyToClipboard } from './utils';

export const setupShortcuts = store => {
  /**
   * Copy password to clipboard
   */
  Mousetrap.bind('mod+c', () => {
    const selection = window.getSelection().toString();
    const currentEntry = getCurrentEntry(store.getState());

    if (!selection && currentEntry) {
      copyToClipboard(currentEntry.properties.password);
    }
  });
};
