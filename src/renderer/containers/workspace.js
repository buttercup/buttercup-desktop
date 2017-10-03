import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { installUpdate } from '../../shared/actions/update';
import { setColumnSize } from '../../shared/actions/settings';
import {
  getCurrentArchive,
  getSetting,
  getUIState,
  getArchivesCount
} from '../../shared/selectors';

export default connect(
  state => ({
    columnSizes: getSetting(state, 'columnSizes'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    currentArchive: getCurrentArchive(state),
    archivesCount: getArchivesCount(state),
    update: state.update,
    savingArchive: getUIState(state, 'savingArchive'),
    isExiting: getUIState(state, 'isExiting')
  }),
  {
    setColumnSize,
    installUpdate
  }
)(Workspace, 'Workspace');
