import React, { Component, PropTypes } from 'react';
import Column from '../column';
import localStyles from '../styles/entries.scss';

class Entries extends Component {
  render() {
    const { entries, currentEntry, currentGroup, handleAddEntry } = this.props;
    const addButton = (<button onClick={handleAddEntry} disabled={Boolean(currentGroup) !== true}>Add Entry</button>);

    return (
      <Column
        className={[localStyles.entriesList]}
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
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  currentGroup: PropTypes.string,
  onSelectEntry: PropTypes.func,
  handleAddEntry: PropTypes.func
};

export default Entries;
