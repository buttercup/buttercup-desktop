import { UI_STATE_SET } from './types';

export const setUIState = (key, value) => ({
  type: UI_STATE_SET,
  payload: {
    key,
    value
  }
});

export const setIsRenaming = isRenaming => setUIState('isRenaming', isRenaming);

export const setSavingArchive = isSaving =>
  setUIState('savingArchive', isSaving);

export const setIsArchiveSearchVisible = isSaving =>
  setUIState('isArchiveSearchVisible', isSaving);
