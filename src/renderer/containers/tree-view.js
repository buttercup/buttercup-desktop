import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import {
  getGroups,
  getCurrentGroup,
  addGroup,
  removeGroup,
  saveGroupTitle,
  moveGroupToParent,
  loadGroup
} from '../redux/modules/groups';
import { setExpandedKeys } from '../redux/modules/tree';

export default connect(
  state => ({
    groups: getGroups(state.groups),
    expandedKeys: state.ui.tree.expandedKeys,
    selectedKeys: [getCurrentGroup(state.groups)]
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
