import React, { Component, PropTypes } from 'react';
import { style, merge, $ } from 'glamor';
import Column from '../column';

class Entries extends Component {
  handleChange(e) {
    this.props.onFilterChange(e.target.value);
  }

  render() {
    const { entries, currentEntry, currentGroup, handleAddEntry } = this.props;
    const addButton = <button onClick={handleAddEntry} disabled={Boolean(currentGroup) !== true}>Add Entry</button>;
    const filterNode = <input type="search" onChange={e => this.handleChange(e)}/>;

    return (
      <Column
        className={styles.column}
        header={filterNode}
        footer={addButton}
        >
        <ul className={styles.list}>
          {entries.map(entry => 
            <li
              key={entry.id}
              className={merge(
                styles.item,
                (currentEntry && entry.id === currentEntry.id) && styles.activeItem
              )}
              onClick={() => this.props.onSelectEntry(entry.id)}
              >
              <strong>{entry.properties.title}</strong>
              <small>{entry.properties.username}</small>
            </li>
          )}
        </ul>
      </Column>
    );
  }
}

Entries.propTypes = {
  filter: PropTypes.string,
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  currentGroup: PropTypes.string,
  onSelectEntry: PropTypes.func,
  onFilterChange: PropTypes.func,
  handleAddEntry: PropTypes.func
};

const styles = {
  column: style({
    backgroundColor: '#31353D',
    color: '#fff'
  }),
  list: style({
    listStyle: 'none',
    margin: 0,
    padding: 0
  }),
  item: merge(
    {
      padding: '.7em 1em',
      cursor: 'pointer'
    },
    $(' strong, small', {
      display: 'block',
      fontWeight: 'normal'
    }),
    $(' small', {
      opacity: 0.5
    })
  ),
  activeItem: style({
    backgroundColor: '#00B7AC'
  })
};

export default Entries;
