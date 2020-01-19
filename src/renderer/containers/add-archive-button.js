import { connect } from 'react-redux';
import {
  openArchive,
  newArchive,
  openFileManager
} from '../../shared/actions/files';
import { getSetting } from '../../shared/selectors';
import AddArchiveButton from '../components/add-archive-button';

export default connect(
  state => ({
    globalShortcuts: getSetting(state, 'globalShortcuts')
  }),
  {
    onOpenClick: openArchive,
    onNewClick: newArchive,
    onCloudClick: openFileManager
  }
)(AddArchiveButton);
