import omit from 'lodash/omit';

export const filterStore = (store = {}) => {
  return omit(store, [
    'groups',
    'entries',
    'form',
    'uiState',
    'currentArchive'
  ]);
};
