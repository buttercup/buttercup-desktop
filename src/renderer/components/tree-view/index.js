import React, { Component } from 'react';
import { isString } from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/md/add';
import { Button } from '@buttercup/ui';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import {
  showContextMenu,
  createMenuFromGroups,
  createSortMenu
} from '../../system/menu';
import { isOSX } from '../../../shared/utils/platform';
import '../../styles/tree-view.global';
import BaseColumn from '../column';
import TreeLabel from './tree-label';

const Column = styled(BaseColumn)`
  background-color: ${isOSX() ? 'var(--groups-bg-mac)' : 'var(--groups-bg)'};
  color: #fff;
  padding-top: var(--spacing-one);
`;

class TreeView extends Component {
  static propTypes = {
    expandedKeys: PropTypes.array,
    selectedKeys: PropTypes.array,
    groups: PropTypes.array,
    sortMode: PropTypes.string,
    onRemoveClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onCreateNew: PropTypes.func,
    onDismissClick: PropTypes.func,
    onAddClick: PropTypes.func,
    onRenameClick: PropTypes.func,
    onGroupSelect: PropTypes.func,
    onEmptyTrash: PropTypes.func,
    onMoveGroup: PropTypes.func,
    onSortModeChange: PropTypes.func,
    onExpand: PropTypes.func,
    intl: intlShape.isRequired
  };

  handleColumnRightClick() {
    const { sortMode, onSortModeChange, intl } = this.props;

    showContextMenu([
      {
        label: intl.formatMessage({
          id: 'new-group',
          defaultMessage: 'New Group'
        }),
        click: () => this.handleAddClick()
      },
      { type: 'separator' },
      ...createSortMenu(
        [
          {
            mode: 'title-asc',
            label: intl.formatMessage({
              id: 'title-asc',
              defaultMessage: 'Title: Ascending'
            }),
            icon: 'sort-alpha-asc'
          },
          {
            mode: 'title-desc',
            label: intl.formatMessage({
              id: 'title-desc',
              defaultMessage: 'Title: Descending'
            }),
            icon: 'sort-alpha-desc'
          }
        ],
        sortMode,
        newMode => onSortModeChange(newMode)
      )
    ]);
  }

  handleRightClick = (node, groups, e) => {
    const { id: groupId, isTrash, depth } = node;
    const { intl } = this.props;

    // Prevent righ click from propagation to parent
    e.stopPropagation();

    if (isTrash) {
      showContextMenu([
        {
          label: intl.formatMessage({
            id: 'empty-trash',
            defaultMessage: 'Empty Trash'
          }),
          click: () => this.props.onEmptyTrash()
        }
      ]);
    } else {
      const nonRootContextMenu =
        depth > 0
          ? [
              {
                label: intl.formatMessage({
                  id: 'move-to-root',
                  defaultMessage: 'Move to Root'
                }),
                click: () => this.props.onMoveGroup(groupId, null)
              }
            ]
          : [];

      const availableGroups = createMenuFromGroups(
        groups,
        groupId,
        selectedGroupId => {
          this.props.onMoveGroup(groupId, selectedGroupId);
        },
        false
      );

      const groupsMenu =
        availableGroups.items.length > 0
          ? {
              submenu: availableGroups
            }
          : {};

      showContextMenu([
        {
          label: intl.formatMessage({
            id: 'add-group',
            defaultMessage: 'Add Group'
          }),
          click: () => this.handleAddClick(null, groupId)
        },
        { type: 'separator' },
        ...nonRootContextMenu,
        {
          label: intl.formatMessage({
            id: 'move-to-group',
            defaultMessage: 'Move to Group'
          }),
          enabled: availableGroups.items,
          ...groupsMenu
        },
        {
          label: intl.formatMessage({
            id: 'rename',
            defaultMessage: 'Rename'
          }),
          click: () => this.props.onRenameClick(groupId)
        },
        { type: 'separator' },
        {
          label: intl.formatMessage({
            id: 'delete',
            defaultMessage: 'Delete'
          }),
          click: () => this.handleRemoveClick(null, groupId)
        }
      ]);
    }
  };

  handleAddClick = (e, id) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onAddClick(isString(id) ? id : null);
  };

  handleRemoveClick = (e, id = null) => {
    if (e) {
      e.stopPropagation();
    }
    this.props.onRemoveClick(isString(id) ? id : null);
  };

  handleExpand = expandedKeys => {
    this.props.onExpand(expandedKeys);
  };

  handleDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    this.props.onMoveGroup(dragKey, dropKey, info.dropToGap);
  };

  handleSelect = ([selectedGroupId], { node }) => {
    const { isNew, isRenaming } = node.props;
    if (typeof selectedGroupId === 'string' && !isNew && !isRenaming) {
      this.props.onGroupSelect(selectedGroupId);
    }
  };

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
            isNew={node.isNew}
            isRenaming={node.isRenaming}
            key={node.id}
            className={cx({
              'is-trash': node.isTrash,
              'is-empty': node.groups.length === 0,
              node: true
            })}
            title={
              <TreeLabel
                node={node}
                onRightClick={e => this.handleRightClick(node, groups, e)}
                onAddClick={this.handleAddClick}
                onRemoveClick={this.handleRemoveClick}
                onSaveClick={this.props.onSaveClick}
                onCreateNew={this.props.onCreateNew}
                onDismissClick={this.props.onDismissClick}
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
          <Button onClick={this.handleAddClick} dark full icon={<PlusIcon />}>
            <FormattedMessage id="new-group" defaultMessage="New Group" />
          </Button>
        }
        onContextMenu={() => this.handleColumnRightClick()}
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

export default injectIntl(TreeView);
