import React, { Component, PropTypes } from 'react';
import { style } from 'glamor';
import PlusIcon from 'react-icons/lib/md/add';
import { showContextMenu, createMenuFromGroups } from '../../system/menu';
import Column from '../column';
import Button from '../button';
import List from './entries-list';
import SearchField from './search-field';

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
    const filterNode = <SearchField onChange={e => this.handleChange(e)}/>;

    return (
      <Column
        className={style({
          backgroundColor: '#31353D',
          color: '#fff'
        })}
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
