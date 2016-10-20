import { connect } from 'react-redux';
import TreeView from '../components/TreeView';
import { addGroup, removeGroup, saveGroupTitle, moveGroupToParent, loadGroup } from '../redux/modules/groups';

export default connect(
  state => ({
    groups: state.groups
  }),
  {
    onAddClick: addGroup,
    onRemoveClick: removeGroup,
    onSaveClick: saveGroupTitle,
    onDrop: moveGroupToParent,
    onGroupSelect: loadGroup
  }
)(TreeView, 'TreeView');
