import React, { Component, PropTypes } from 'react';
import 'style!raw!./TreeView.css';
import Tree, { TreeNode } from 'rc-tree';
import TreeLabel from './TreeLabel';

class TreeView extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true
    };
  }

  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  }

  onDrop(info) {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.setState({
      expandedKeys: [
        ...this.state.expandedKeys,
        dropKey
      ]
    });
    this.props.onDrop(dragKey, dropKey);
  }

  onAddClick(e, id) {
    e.stopPropagation();
    this.setState({
      expandedKeys: [
        ...this.state.expandedKeys,
        id
      ]
    });
    this.props.onAddClick(id);
  }

  onRemoveClick(e, id) {
    e.stopPropagation();
    this.props.onRemoveClick(id);
  }

  render() {
    const loop = children => {
      if (!children) {
        return null;
      }

      return children.map(node => {
        return (
          <TreeNode
            key={node.id}
            title={
              <TreeLabel
                {...node}
                {...this.props}
                onAddClick={(e, id) => this.onAddClick(e, id)}
                onRemoveClick={(e, id) => this.onRemoveClick(e, id)}
                />
            }
            >
            {loop(node.children)}
          </TreeNode>
        );
      });
    };

    return (
      <Tree
        defaultExpandAll
        draggable
        showLine={false}
        expandedKeys={this.state.expandedKeys}
        onExpand={(...args) => this.onExpand(...args)}
        onDrop={(...args) => this.onDrop(...args)}
        >
        {loop(this.props.groups)}
      </Tree>
    );
  }
}

TreeView.propTypes = {
  groups: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onDrop: PropTypes.func
};

export default TreeView;
