import React, { Component, PropTypes } from 'react';
import Tree from 'react-ui-tree';
import 'style!raw!./TreeView.css';

class TreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange() {

  }

  onClickNode() {

  }

  renderNode(node) {
    return (
      <span>
        {node.title}
      </span>
    );
  }

  render() {
    return (
      <Tree
        paddingLeft={20}
        tree={this.props.tree}
        onChange={this.handleChange}
        isNodeCollapsed={this.isNodeCollapsed}
        renderNode={this.renderNode}
        />
    );
  }
}

TreeView.propTypes = {
  tree: PropTypes.object
};

export default TreeView;
