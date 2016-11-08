import { connect } from 'react-redux';
import { removeRecent, clearRecent } from '../redux/modules/recents';
import { openFile } from '../redux/modules/files';
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
