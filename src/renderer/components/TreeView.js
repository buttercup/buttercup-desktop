import React, { Component, PropTypes } from 'react';
import 'style!raw!./TreeView.css';
import Tree, { TreeNode } from 'rc-tree';

class TreeView extends Component {
  render() {
    const loop = children => {
      if (!children) {
        return null;
      }

      return children.map(node => {
        const label = (
          <span>
            {node.title}
            <button onClick={() => this.props.onRemoveClick(node.id)}>&times;</button>
            <button onClick={() => this.props.onAddClick(node.id)}>+</button>
          </span>
        );
        return (
          <TreeNode
            key={node.id}
            title={label}
            >
            {loop(node.children)}
          </TreeNode>
        );
      });
    };

    return (
      <Tree defaultExpandAll showLine={false}>
        {loop(this.props.groups)}
      </Tree>
    );
  }
}

TreeView.propTypes = {
  groups: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onAddClick: PropTypes.func
};

export default TreeView;
