import { connect } from 'react-redux';
import { removeArchive, unlockArchive, loadArchive } from '../../shared/actions/archives';
import { openArchive, newArchive, openFileManager } from '../../shared/actions/files';
import { getSortedArchives } from '../../shared/selectors';
import ArchiveList from '../components/sidebar';

export default connect(
  state => ({
    archives: getSortedArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onUnlockClick: unlockArchive,
    onClick: loadArchive,
    onOpenClick: openArchive,
    onNewClick: newArchive,
    onCloudClick: openFileManager
  }
)(ArchiveList);
