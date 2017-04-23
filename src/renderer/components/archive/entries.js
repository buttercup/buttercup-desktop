import React, { Component, PropTypes } from 'react';
import PlusIcon from 'react-icons/lib/md/add';
import cx from 'classnames';
import { Button } from 'buttercup-ui';
import { isOSX } from '../../system/utils';
import { showContextMenu, createMenuFromGroups } from '../../system/menu';
import Column from '../column';
import styles from '../../styles/entries';
import List from './entries-list';
import SearchField from './search-field';
import SortButton from './sort-button';

class Entries extends Component {
  handleFilterChange = value => {
    this.props.onFilterChange(value);
  }

  handleSortModeChange = newMode => {
    this.props.onSortModeChange(newMode);
  }

  onRightClick(entry) {
    const { groups, currentGroup, onEntryMove, onDelete } = this.props;
    showContextMenu([
      {
        label: 'Move to Group',
        submenu: createMenuFromGroups(groups, currentGroup, groupId => {
          onEntryMove(entry.id, groupId);
        })
      },
      {
        label: 'Move to Trash',
        enabled: !entry.isInTrash,
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
        disabled={Boolean(currentGroup) !== true}
        full
        dark
        icon={<PlusIcon />}
        >Add Entry</Button>
    );
    const filterNode = (
      <div className={styles.searchWrapper}>
        <SearchField onChange={this.handleFilterChange} filter={filter} />
        <SortButton mode={sortMode} onChange={this.handleSortModeChange} />
      </div>
    );

    return (
      <Column
        className={cx(styles.column, isOSX() && styles.mac)}
        header={filterNode}
        footer={addButton}
        >
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
  currentGroup: PropTypes.string,
  onSelectEntry: PropTypes.func,
  onFilterChange: PropTypes.func,
  onSortModeChange: PropTypes.func,
  onEntryMove: PropTypes.func,
  onDelete: PropTypes.func,
  handleAddEntry: PropTypes.func
};

export default Entries;
