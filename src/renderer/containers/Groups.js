import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Treebeard } from 'react-treebeard';
import { removeRecent, clearRecent } from '../redux/modules/groups';

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleOnToggle = this.handleOnToggle.bind(this);
  }

  handleOnToggle(node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children.length > 0) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  render() {
    return (
      <Treebeard
        data={this.props.groups}
        onToggle={this.handleOnToggle}
        />
    );
  }
}

Groups.propTypes = {
  groups: PropTypes.array,
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
