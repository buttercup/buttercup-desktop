import React, { Component, PropTypes } from 'react';
import { isString } from 'lodash';
import cx from 'classnames';
import Tree, { TreeNode } from 'rc-tree';
import PlusIcon from 'react-icons/lib/md/add';
import { Button } from 'buttercup-ui';
import { showContextMenu, createMenuFromGroups, createSortMenu } from '../../system/menu';
import { isOSX } from '../../system/utils';
import '../../styles/tree-view.global';
import styles from '../../styles/tree-view';
import Column from '../column';
import TreeLabel from './tree-label';

class TreeView extends Component {
  handleColumnRightClick() {
    const { sortMode, onSortModeChange } = this.props;

    showContextMenu([
      {
        label: 'New Group',
        click: () => this.handleAddClick()
      },
      { type: 'separator' },
      ...createSortMenu(
        [
          {
            mode: 'title-asc',
            label: 'Title: Ascending',
            icon: 'sort-alpha-asc'
          },
          {
            mode: 'title-desc',
            label: 'Title: Descending',
            icon: 'sort-alpha-desc'
          }
        ],
        sortMode,
        newMode => onSortModeChange(newMode)
      )
    ]);
  }

  handleRightClick = (node, groups, e) => {
    const { id: groupId, isTrash } = node;

    // Prevent righ click from propagation to parent
    e.stopPropagation();

    if (isTrash) {
      showContextMenu([
        {
          label: 'Empty Trash',
          click: () => this.props.onEmptyTrash()
        }
      ]);
    } else {
      showContextMenu([
        {
          label: 'Add Group', 
          click: () => this.handleAddClick(null, groupId)
        },
        { type: 'separator' },
        {
          label: 'Move to Root',
          click: () => this.props.onMoveGroup(groupId, null)
        },
        {
          label: 'Move to Group',
          submenu: createMenuFromGroups(groups, groupId, selectedGroupId => {
            this.props.onMoveGroup(groupId, selectedGroupId);
          }, false)
        },
        { type: 'separator' },
        {
          label: 'Delete',
          click: () => this.handleRemoveClick(null, groupId)
        }
      ]);
    }
  }

  handleAddClick = (e, id) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onAddClick(isString(id) ? id : null);
  }

  handleRemoveClick = (e, id = null) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onRemoveClick(isString(id) ? id : null);
  }

  handleExpand = expandedKeys => {
    this.props.onExpand(expandedKeys);
  }

  handleDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.props.onMoveGroup(dragKey, dropKey, info.dropToGap);
  }

  handleSelect = ([selectedGroupId]) => {
    if (typeof selectedGroupId === 'string') {
      this.props.onGroupSelect(selectedGroupId);
    }
  }

  render() {
    const { groups } = this.props;

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
                onRightClick={e => this.handleRightClick(node, groups, e)}
                onAddClick={this.handleAddClick}
                onRemoveClick={this.handleRemoveClick}
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
            onClick={this.handleAddClick}
            dark
            full
            icon={<PlusIcon/>}
            >New Group</Button>
        }
        className={cx(styles.column, isOSX() && styles.mac)}
        onContextMenu={this.handleColumnRightClick.bind(this)}
        >
        <Tree
          draggable
          showLine={false}
          selectedKeys={this.props.selectedKeys}
          expandedKeys={this.props.expandedKeys}
          onSelect={this.handleSelect}
          onExpand={this.handleExpand}
          onDrop={this.handleDrop}
          >
          {loop(groups)}
        </Tree>
      </Column>
    );
  }
}

TreeView.propTypes = {
  expandedKeys: PropTypes.array,
  selectedKeys: PropTypes.array,
  groups: PropTypes.array,
  sortMode: PropTypes.string,
  onRemoveClick: PropTypes.func,
  onAddClick: PropTypes.func,
  onGroupSelect: PropTypes.func,
  onEmptyTrash: PropTypes.func,
  onMoveGroup: PropTypes.func,
  onSortModeChange: PropTypes.func,
  onExpand: PropTypes.func
};

export default TreeView;
