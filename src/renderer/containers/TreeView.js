import { connect } from 'react-redux';
import TreeView from '../components/TreeView';
import { addGroup, removeGroup, saveGroupTitle, moveGroupToParent } from '../redux/modules/groups';

const mapStateToProps = state => ({
  groups: state.groups
});

const mapDispatchToProps = dispatch => ({
  onAddClick: id => dispatch(addGroup(id)),
  onRemoveClick: id => dispatch(removeGroup(id)),
  onSaveClick: (id, title) => dispatch(saveGroupTitle(id, title)),
  onDrop: (groupId, newParentId) => dispatch(moveGroupToParent(groupId, newParentId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeView, 'TreeView');
