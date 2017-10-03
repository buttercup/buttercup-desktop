import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PlusIcon from 'react-icons/lib/md/add';
import styled from 'styled-components';
import { Button } from '@buttercup/ui';
import { isOSX } from '../../../shared/utils/platform';
import {
  showContextMenu,
  createMenuFromGroups,
  createCopyMenu
} from '../../system/menu';
import BaseColumn from '../column';
import List from './entries-list';
import SearchField from './search-field';
import SortButton from './sort-button';

const Column = styled(BaseColumn)`
  background-color: ${isOSX() ? 'var(--entries-bg-mac)' : 'var(--entries-bg)'};
  color: #fff;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: calc(-1 * var(--spacing-half));

  button {
    color: #fff;
  }
`;

class Entries extends Component {
  handleFilterChange = value => {
    this.props.onFilterChange(value);
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
      onDelete
    } = this.props;
    showContextMenu([
      ...createCopyMenu(entry, currentEntry),
      { type: 'separator' },
      {
        label: 'Move to Group',
        submenu: createMenuFromGroups(groups, currentGroup, groupId => {
          onEntryMove(entry.id, groupId);
        })
      },
      {
        label: entry.isInTrash ? 'Delete Permanently' : 'Move to Trash',
        click() {
          onDelete(entry.id);
        }
      }
    ]);
  }

  render() {
    const { currentGroup, handleAddEntry, sortMode, filter } = this.props;
    const addButton = (
      <Button
        onClick={handleAddEntry}
        disabled={!currentGroup || currentGroup.isTrash}
        full
        dark
        icon={<PlusIcon />}
      >
        Add Entry
      </Button>
    );
    const filterNode = (
      <SearchWrapper>
        <SearchField onChange={this.handleFilterChange} filter={filter} />
        <SortButton mode={sortMode} onChange={this.handleSortModeChange} />
      </SearchWrapper>
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

Entries.propTypes = {
  filter: PropTypes.string,
  sortMode: PropTypes.string,
  entries: PropTypes.array,
  groups: PropTypes.array,
  currentEntry: PropTypes.object,
  currentGroup: PropTypes.object,
  onSelectEntry: PropTypes.func,
  onFilterChange: PropTypes.func,
  onSortModeChange: PropTypes.func,
  onEntryMove: PropTypes.func,
  onDelete: PropTypes.func,
  handleAddEntry: PropTypes.func
};

export default Entries;
