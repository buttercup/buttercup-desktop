import React, { Component, PropTypes } from 'react';
import Tree, { TreeNode } from 'rc-tree';
import { style } from 'glamor';
import '../styles/tree-view.global.scss';
import Column from '../column';
import TreeLabel from './tree-label';

class TreeView extends Component {
  onExpand(expandedKeys) {
    this.props.onExpand(expandedKeys);
  }

  onDrop(info) {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.props.onDrop(dragKey, dropKey);
  }

  onSelect([selectedGroupId]) {
    if (typeof selectedGroupId === 'string') {
      this.props.onGroupSelect(selectedGroupId);
    }
  }

  onAddClick(e, id) {
    e.stopPropagation();
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
            {loop(node.groups)}
          </TreeNode>
        );
      });
    };

    return (
      <Column
        footer={<button onClick={e => this.onAddClick(e, null)}>Add Group</button>}
        className={styles.column}
        >
        <Tree
          defaultExpandAll
          draggable
          showLine={false}
          selectedKeys={this.props.selectedKeys}
          expandedKeys={this.props.expandedKeys}
          onSelect={(...args) => this.onSelect(...args)}
          onExpand={(...args) => this.onExpand(...args)}
          onDrop={(...args) => this.onDrop(...args)}
          >
          {loop(this.props.groups)}
        </Tree>
      </Column>
    );
  }
}

TreeView.propTypes = {
  expandedKeys: PropTypes.array,
  selectedKeys: PropTypes.array,
  groups: PropTypes.array,
  onRemoveClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onGroupSelect: PropTypes.func,
  onDrop: PropTypes.func,
  onExpand: PropTypes.func
};

const styles = {
  column: style({
    backgroundColor: '#292C33',
    color: '#fff'
  })
};

export default TreeView;
