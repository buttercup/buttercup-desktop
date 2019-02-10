import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { setColumnSize } from '../../shared/actions/settings';
import {
  getCurrentArchive,
  getSetting,
  getArchivesCount,
  getUIState,
  getArchive
} from '../../shared/selectors';
import {
  loadOrUnlockArchive,
  addArchiveFromSource,
  changeArchivePassword
} from '../../shared/actions/archives';
import { PasswordDialogRequestTypes } from '../../shared/buttercup/types';

export default connect(
  state => ({
    columnSizes: getSetting(state, 'columnSizes'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    archivesLoading: getSetting(state, 'archivesLoading'),
    currentArchive: getCurrentArchive(state),
    archivesCount: getArchivesCount(state),
    savingArchive: getUIState(state, 'savingArchive'),
    isArchiveSearchVisible: getUIState(state, 'isArchiveSearchVisible')
  }),
  {
    setColumnSize,
    onValidate: (modalRequest, password) => dispatch => {
      const { type, payload } = modalRequest;
      switch (type) {
        case PasswordDialogRequestTypes.UNLOCK:
          return dispatch(loadOrUnlockArchive(payload, password));
        case PasswordDialogRequestTypes.NEW_VAULT:
          return dispatch(addArchiveFromSource(payload, password));
        case PasswordDialogRequestTypes.PASSWORD_CHANGE:
          return dispatch(changeArchivePassword(payload, password));
        case PasswordDialogRequestTypes.IMPORT:
          ipcRenderer.send('import-history-prompt-resp', password);
          return Promise.resolve();
        default:
          throw new Error('Invalid prompt type');
      }
    },
    isVaultUnlocked: vaultId => (_, getState) =>
      getArchive(getState(), vaultId).status === 'unlocked'
  }
)(Workspace, 'Workspace');
