import { connect } from 'react-redux';
import Workspace from '../components/workspace';
import { installUpdate } from '../redux/modules/ui';

export default connect(
  state => ({
    workspace: state.workspace,
    update: state.ui.update
  }),
  {
    installUpdate
  }
)(Workspace, 'Workspace');
