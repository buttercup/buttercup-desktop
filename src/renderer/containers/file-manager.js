import { connect } from 'react-redux';
import FileManager from '../components/file-manager';
import * as managerTools from '../redux/modules/file-manager'; 

export default connect(
  state => ({
    currentPath: state.manager.currentPath,
    contents: state.manager.contents
  }),
  {
    handleNavigate: managerTools.navigate,
    handleCreateNewDirectory: managerTools.addDirectory
  }
)(FileManager);
