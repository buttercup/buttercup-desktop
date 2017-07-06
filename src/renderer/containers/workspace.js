import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { installUpdate } from '../../shared/actions/update';
import { setColumnSize } from '../../shared/actions/settings';
import { getCurrentArchive, getSetting } from '../../shared/selectors';

export default connect(
  state => ({
    columnSizes: getSetting(state, 'columnSizes'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    currentArchive: getCurrentArchive(state),
    update: state.update,
  }),
  {
    setColumnSize,
    installUpdate
  }
)(Workspace, 'Workspace');
