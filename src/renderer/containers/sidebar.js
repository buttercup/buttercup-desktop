import { connect } from 'react-redux';
import {
  removeArchive,
  loadOrUnlockArchive,
  updateArchive,
  showImportDialog
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
    onOpenClick: openArchive,
    onNewClick: newArchive,
    onArchiveUpdate: updateArchive,
    onCloudClick: openFileManager,
    showImportDialog
  }
)(ArchiveList);
