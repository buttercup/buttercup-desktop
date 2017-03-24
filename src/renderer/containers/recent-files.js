import { connect } from 'react-redux';
import { removeRecent, clearRecent } from '../../shared/actions/recents';
import { openFile } from '../../shared/actions/files';
import RecentFiles from '../components/recent-files';

export default connect(
  state => ({
    recentFiles: state.recentFiles
  }),
  {
    onRemoveClick: removeRecent,
    onClearClick: clearRecent,
    onClick: openFile
  }
)(RecentFiles);
