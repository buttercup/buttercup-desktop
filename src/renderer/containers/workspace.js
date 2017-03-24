import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { installUpdate } from '../../shared/actions/update';
import { getCurrentArchive } from '../../shared/selectors';

export default connect(
  state => ({
    currentArchive: getCurrentArchive(state),
    update: state.update,
  }),
  {
    installUpdate
  }
)(Workspace, 'Workspace');
