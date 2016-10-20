import { connect } from 'react-redux';
import Workspace from '../components/workspace';

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(
  mapStateToProps,
  null
)(Workspace, 'Workspace');
