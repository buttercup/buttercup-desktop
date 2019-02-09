import { remote } from 'electron';
import { connect } from 'react-redux';
import {
  removeArchive,
  lockArchive,
  changeArchivePassword,
  changeArchiveColour,
  showImportDialog,
  changeArchiveOrder,
  exportArchive
} from '../../shared/actions/archives';
import {
  openArchive,
  newArchive,
  openFileManager
} from '../../shared/actions/files';
import { getAllArchives, getCurrentArchiveId } from '../../shared/selectors';
import ArchiveList from '../components/sidebar';

export default connect(
  state => ({
    archives: getAllArchives(state),
    currentArchiveId: getCurrentArchiveId(state)
  }),
  {
    onRemoveClick: removeArchive,
    onClick: vaultId => () => {
      remote.BrowserWindow.getFocusedWindow().webContents.send(
        'set-current-archive',
        vaultId
      );
    },
    onLockArchive: lockArchive,
    onChangePassword: changeArchivePassword,
    onChangeColour: changeArchiveColour,
    onChangeOrder: changeArchiveOrder,
    onOpenClick: openArchive,
    onNewClick: newArchive,
    onCloudClick: openFileManager,
    showImportDialog,
    onExportArchive: exportArchive
  }
)(ArchiveList);
