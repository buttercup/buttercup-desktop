import { connect } from 'react-redux';
import { removeArchive, unlockArchive, loadArchive } from '../../shared/actions/archives';
import { getSortedArchives } from '../../shared/selectors';
import ArchiveList from '../components/sidebar';

export default connect(
  state => ({
    archives: getSortedArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onUnlockClick: unlockArchive,
    onClick: loadArchive
  }
)(ArchiveList);
