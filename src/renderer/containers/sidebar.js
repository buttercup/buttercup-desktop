import { connect } from 'react-redux';
import { removeArchive, clearArchives, loadArchive } from '../../shared/actions/archives';
import { getSortedArchives } from '../../shared/selectors';
import ArchiveList from '../components/sidebar';

export default connect(
  state => ({
    archives: getSortedArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onClearClick: clearArchives,
    onClick: loadArchive
  }
)(ArchiveList);
