import { connect } from 'react-redux';
import TreeView from '../components/tree-view';
import * as groupTools from '../../shared/actions/groups';
import { getGroups, getCurrentGroup } from '../../shared/reducers/groups';
import { setExpandedKeys } from '../../shared/actions/tree';

export default connect(
  state => ({
    groups: getGroups(state.groups),
    sortMode: state.groups.sortMode,
    expandedKeys: state.ui.tree.expandedKeys,
    selectedKeys: [getCurrentGroup(state.groups)]
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
