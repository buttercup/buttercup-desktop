import { connect } from 'react-redux';
import {
  openArchive,
  newArchive,
  openFileManager
} from '../../shared/actions/files';
import AddArchiveButton from '../components/add-archive-button';

export default connect(state => ({}), {
  onOpenClick: openArchive,
  onNewClick: newArchive,
  onCloudClick: openFileManager
})(AddArchiveButton);
