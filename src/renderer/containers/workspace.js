import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { setColumnSize } from '../../shared/actions/settings';
import {
  getCurrentArchive,
  getSetting,
  getArchivesCount,
  getUIState
} from '../../shared/selectors';

export default connect(
  state => ({
    columnSizes: getSetting(state, 'columnSizes'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    archivesLoading: getSetting(state, 'archivesLoading'),
    currentArchive: getCurrentArchive(state),
    archivesCount: getArchivesCount(state),
    savingArchive: getUIState(state, 'savingArchive'),
    isArchiveSearchVisible: getUIState(state, 'isArchiveSearchVisible')
  }),
  {
    setColumnSize
  }
)(Workspace, 'Workspace');
