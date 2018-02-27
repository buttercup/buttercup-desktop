import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import PlusIcon from 'react-icons/lib/md/add';
import styled from 'styled-components';
import { Button } from '@buttercup/ui';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
import { isOSX } from '../../../shared/utils/platform';
import {
  showContextMenu,
  createMenuFromGroups,
  createCopyMenu
} from '../../system/menu';
import BaseColumn from '../column';
import List from './entries-list';
import SortButton from './sort-button';

const Column = styled(BaseColumn)`
  background-color: ${isOSX() ? 'var(--entries-bg-mac)' : 'var(--entries-bg)'};
  color: #fff;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: calc(-1 * var(--spacing-half));

  button {
    color: #fff;
  }
`;

const EntriesCount = styled.div`
  flex: 1;
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.5);
`;

class Entries extends PureComponent {
  static propTypes = {
    sortMode: PropTypes.string,
    entries: PropTypes.array,
    groups: PropTypes.array,
    currentEntry: PropTypes.object,
    currentGroup: PropTypes.object,
    onSelectEntry: PropTypes.func,
    onSortModeChange: PropTypes.func,
    onEntryMove: PropTypes.func,
    onDelete: PropTypes.func,
    handleAddEntry: PropTypes.func,
    t: PropTypes.func
  };

  handleSortModeChange = newMode => {
    this.props.onSortModeChange(newMode);
  };

  onRightClick(entry) {
    const {
      groups,
      currentGroup,
      currentEntry,
      onEntryMove,
      onDelete,
      t
    } = this.props;
    showContextMenu([
      ...createCopyMenu(entry, currentEntry),
      { type: 'separator' },
      {
        label: t('entry-menu.move-to-group'),
        submenu: createMenuFromGroups(groups, currentGroup, groupId => {
          onEntryMove(entry.id, groupId);
        })
      },
      {
        label: entry.isInTrash
          ? t('entry-menu.delete-permanently')
          : t('entry-menu.move-to-trash'),
        click() {
          onDelete(entry.id);
        }
      }
    ]);
  }

  render() {
    const { currentGroup, handleAddEntry, sortMode } = this.props;
    const addButton = (
      <Button
        onClick={handleAddEntry}
        disabled={!currentGroup || currentGroup.isTrash}
        full
        dark
        icon={<PlusIcon />}
      >
        <Translate i18nKey="entry.add-entry" parent="span" />
      </Button>
    );
    const filterNode = (
      <HeaderWrapper>
        <EntriesCount>
          <Translate
            i18nKey="entry.displaying-entries"
            parent="span"
            values={{ count: this.props.entries.length }}
          />
        </EntriesCount>
        <SortButton mode={sortMode} onChange={this.handleSortModeChange} />
      </HeaderWrapper>
    );

    return (
      <Column header={filterNode} footer={addButton}>
        <List
          entries={this.props.entries}
          currentEntry={this.props.currentEntry}
          onSelectEntry={this.props.onSelectEntry}
          onRightClick={entry => this.onRightClick(entry)}
        />
      </Column>
    );
  }
}

export default translate()(Entries);
