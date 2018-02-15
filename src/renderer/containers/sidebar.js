import { connect } from 'react-redux';
import {
  removeArchive,
  loadOrUnlockArchive,
  lockArchive,
  changeArchivePassword,
  changeArchiveColour,
  showImportDialog,
  changeArchiveOrder
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
    onClick: loadOrUnlockArchive,
    onLockArchive: lockArchive,
    onChangePassword: changeArchivePassword,
    onChangeColour: changeArchiveColour,
    onChangeOrder: changeArchiveOrder,
    onOpenClick: openArchive,
    onNewClick: newArchive,
    onCloudClick: openFileManager,
    showImportDialog
  }
)(ArchiveList);
