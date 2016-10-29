import React, { Component, PropTypes } from 'react';
import { style } from 'glamor';
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
        <ul>
          {entries.map(entry => 
            <li
              key={entry.id}
              onClick={() => this.props.onSelectEntry(entry.id)}
              style={{color: (currentEntry && entry.id === currentEntry.id) ? 'red' : ''}}
              >
              <strong>{entry.properties.title}</strong>
              <br/>{entry.properties.username}
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
  })
};

export default Entries;
