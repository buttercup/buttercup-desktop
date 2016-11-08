import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Tree, { TreeNode } from 'rc-tree';
import PlusIcon from 'react-icons/lib/md/add';
import { showContextMenu } from '../../system/menu';
import { isOSX } from '../../system/utils';
import '../../styles/tree-view.global';
import styles from '../../styles/tree-view';
import Column from '../column';
import Button from '../button';
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
    if (e) {
      e.stopPropagation();
    }
    this.props.onAddClick(id);
  }

  onRemoveClick(e, id) {
    if (e) {
      e.stopPropagation();
    }
    this.props.onRemoveClick(id);
  }

  onRightClick(info) {
    const { id: groupId, isTrash } = info;

    if (isTrash) {
      return;
    }

    showContextMenu([
      {
        label: 'Add Group', 
        click: () => this.onAddClick(null, groupId)
      },
      {
        label: 'Delete',
        click: () => this.onRemoveClick(null, groupId)
      }
    ]);
  }

  render() {
    const loop = children => {
      if (!children) {
        return null;
      }

      return children.map(node => {
        return (
          <TreeNode
            isTrash={node.isTrash}
            key={node.id}
            className={cx({
              'is-trash': node.isTrash,
              'is-empty': node.groups.length === 0,
              'node': true}
            )}
            title={
              <TreeLabel
                {...node}
                {...this.props}
                onRightClick={() => this.onRightClick(node)}
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
        footer={
          <Button
            onClick={e => this.onAddClick(e, null)}
            dark
            full
            icon={<PlusIcon/>}
            >New Group</Button>
        }
        className={cx(styles.column, isOSX() && styles.mac)}
        >
        <Tree
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

export default TreeView;
