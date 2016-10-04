import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import TreeView from '../components/TreeView';
import { removeRecent, clearRecent } from '../redux/modules/groups';

class Groups extends Component {
  render() {
    return (
      <TreeView
        tree={this.props.groups}
        />
    );
  }
}

Groups.propTypes = {
  groups: PropTypes.object,
  onRemoveClick: PropTypes.func,
  onClearClick: PropTypes.func
};

const mapStateToProps = state => ({
  groups: state.groups
});

const mapDispatchToProps = dispatch => ({
  onRemoveClick: filename => dispatch(removeRecent(filename)),
  onClearClick: () => dispatch(clearRecent())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups);
