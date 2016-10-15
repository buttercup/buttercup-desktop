import { connect } from 'react-redux';
import TreeView from '../components/TreeView';
import { addGroup, removeGroup } from '../redux/modules/groups';

const mapStateToProps = state => ({
  groups: state.groups
});

const mapDispatchToProps = dispatch => ({
  onAddClick: id => dispatch(addGroup(id)),
  onRemoveClick: id => dispatch(removeGroup(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeView, 'TreeView');
