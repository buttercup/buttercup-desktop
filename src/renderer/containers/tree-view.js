import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import { addGroup, removeGroup, saveGroupTitle, moveGroupToParent, loadGroup } from '../redux/modules/groups';
import { setExpandedKeys } from '../redux/modules/tree';

export default connect(
  state => ({
    groups: state.groups,
    expandedKeys: state.ui.tree.expandedKeys,
    selectedKeys: state.ui.tree.selectedKeys
  }),
  {
    onAddClick: addGroup,
    onRemoveClick: removeGroup,
    onSaveClick: saveGroupTitle,
    onDrop: moveGroupToParent,
    onGroupSelect: loadGroup,
    onExpand: setExpandedKeys
  }
)(TreeView, 'TreeView');
