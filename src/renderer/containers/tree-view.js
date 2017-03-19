import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import * as groupTools from '../redux/modules/groups';
import { setExpandedKeys } from '../redux/modules/tree';

export default connect(
  state => ({
    groups: groupTools.getGroups(state.groups),
    sortMode: state.groups.sortMode,
    expandedKeys: state.ui.tree.expandedKeys,
    selectedKeys: [groupTools.getCurrentGroup(state.groups)]
  }),
  {
    onAddClick: groupTools.addGroup,
    onRemoveClick: groupTools.removeGroup,
    onSaveClick: groupTools.saveGroupTitle,
    onEmptyTrash: groupTools.emptyTrash,
    onMoveGroup: groupTools.moveGroupToParent,
    onGroupSelect: groupTools.loadGroup,
    onSortModeChange: groupTools.setSortMode,
    onExpand: setExpandedKeys
  }
)(TreeView, 'TreeView');
