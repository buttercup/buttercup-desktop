import { connect } from 'react-redux';
import { removeArchive } from '../../shared/actions/archives';
import { getAllArchives } from '../../shared/selectors';
import { openFile } from '../../shared/actions/files';
import RecentFiles from '../components/recent-files';

export default connect(
  state => ({
    recentFiles: getAllArchives(state)
  }),
  {
    onRemoveClick: removeArchive,
    onClearClick: () => {}, // @TODO: CLEAR ARCHIVES
    onClick: openFile
  }
)(RecentFiles);
