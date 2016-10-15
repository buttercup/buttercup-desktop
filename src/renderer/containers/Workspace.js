import { connect } from 'react-redux';
import Workspace from '../components/Workspace';

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(
  mapStateToProps,
  null
)(Workspace, 'Workspace');
