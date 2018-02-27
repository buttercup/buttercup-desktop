import React, { PureComponent } from 'react';
import { isString } from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import styled from 'styled-components';
import PlusIcon from 'react-icons/lib/md/add';
import { Button } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
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

class TreeView extends PureComponent {
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
    t: PropTypes.func
  };

  handleColumnRightClick() {
    const { sortMode, onSortModeChange, t } = this.props;

    showContextMenu([
      {
        label: t('group-menu.new-group'),
        click: () => this.handleAddClick()
      },
      { type: 'separator' },
      ...createSortMenu(
        [
          {
            mode: 'title-asc',
            label: t('group-menu.title-asc'),
            icon: 'sort-alpha-asc'
          },
          {
            mode: 'title-desc',
            label: t('group-menu.title-desc'),
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
    const { t } = this.props;

    // Prevent righ click from propagation to parent
    e.stopPropagation();

    if (isTrash) {
      showContextMenu([
        {
          label: t('group-menu.empty-trash'),
          click: () => this.props.onEmptyTrash()
        }
      ]);
    } else {
      const nonRootContextMenu =
        depth > 0
          ? [
              {
                label: t('group-menu.move-to-root'),
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
          label: t('group-menu.add-group'),
          click: () => this.handleAddClick(null, groupId)
        },
        { type: 'separator' },
        ...nonRootContextMenu,
        {
          label: t('group-menu.move-to-group'),
          enabled: availableGroups.items.length > 0,
          ...groupsMenu
        },
        {
          label: t('group-menu.rename'),
          click: () => this.props.onRenameClick(groupId)
        },
        { type: 'separator' },
        {
          label: t('group-menu.delete'),
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
            <Translate i18nKey="group.new-group" parent="span" />
          </Button>
        }
        onContextMenu={() => this.handleColumnRightClick()}
      >
        <Tree
          draggable
          showLine={false}
          expandedKeys={this.props.expandedKeys}
          selectedKeys={this.props.selectedKeys}
          autoExpandParent={false}
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

export default translate()(TreeView);
