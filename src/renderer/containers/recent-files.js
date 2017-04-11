import { connect } from 'react-redux';
import { removeArchive, clearArchives, loadArchive } from '../../shared/actions/archives';
import { getSortedArchives } from '../../shared/selectors';
import RecentFiles from '../components/recent-files';

export default connect(
  state => ({
    archives: getSortedArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onClearClick: clearArchives,
    onClick: loadArchive
  }
)(RecentFiles);
