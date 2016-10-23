import { connect } from 'react-redux';
import Workspace from '../components/workspace';

const mapStateToProps = state => ({
  workspace: state.workspace
});

export default connect(
  mapStateToProps,
  null
)(Workspace, 'Workspace');
