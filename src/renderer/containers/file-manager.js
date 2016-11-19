import { connect } from 'react-redux';
import FileManager from '../components/file-manager';
import { navigate } from '../redux/modules/file-manager'; 

export default connect(
  state => ({
    currentPath: state.manager.currentPath,
    contents: state.manager.contents
  }),
  {
    handleNavigate: navigate
  }
)(FileManager);
