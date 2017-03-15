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
  handleChange(value) {
    this.props.onFilterChange(value);
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
        click() {
          onDelete(entry.id);
        }
      }
    ]);
  }

  render() {
    const { currentGroup, handleAddEntry } = this.props;
    const addButton = (
      <Button
        onClick={handleAddEntry}
        disabled={Boolean(currentGroup) !== true}
        full
        dark
        icon={<PlusIcon/>}
        >Add Entry</Button>
    );
    const filterNode = (
      <div className={styles.searchWrapper}>
        <SearchField onChange={e => this.handleChange(e)}/>
        <SortButton/>
      </div>
    );

    return (
      <Column
        className={cx(styles.column, isOSX() && styles.mac)}
        header={filterNode}
        footer={addButton}
        >
        <List {...this.props} onRightClick={entry => this.onRightClick(entry)}/>
      </Column>
    );
  }
}

Entries.propTypes = {
  filter: PropTypes.string,
  entries: PropTypes.array,
  groups: PropTypes.array,
  currentEntry: PropTypes.object,
  currentGroup: PropTypes.string,
  onSelectEntry: PropTypes.func,
  onFilterChange: PropTypes.func,
  onEntryMove: PropTypes.func,
  onDelete: PropTypes.func,
  handleAddEntry: PropTypes.func
};

export default Entries;
