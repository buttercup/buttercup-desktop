import { connect } from 'react-redux';
import { removeArchive, clearArchives } from '../../shared/actions/archives';
import { openFile } from '../../shared/actions/files';
import { getSortedArchives } from '../../shared/selectors';
import RecentFiles from '../components/recent-files';

export default connect(
  state => ({
    recentFiles: getSortedArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onClearClick: clearArchives,
    onClick: openFile
  }
)(RecentFiles);
