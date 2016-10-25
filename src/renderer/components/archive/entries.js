import React, { Component, PropTypes } from 'react';

class Entries extends Component {
  render() {
    const { entries, currentEntry } = this.props;
    return (
      <div>
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
        <button onClick={this.props.handleAddEntry}>Add Entry</button>
      </div>
    );
  }
}

Entries.propTypes = {
  entries: PropTypes.array,
  currentEntry: PropTypes.object,
  onSelectEntry: PropTypes.func,
  handleAddEntry: PropTypes.func
};

export default Entries;
