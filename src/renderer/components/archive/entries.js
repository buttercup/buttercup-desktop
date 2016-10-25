import React, { Component, PropTypes } from 'react';

class Entries extends Component {
  render() {
    const { entries, currentEntry, currentGroup } = this.props;
    return (
      <div>
        <hr/>
        <button onClick={this.props.handleAddEntry} disabled={Boolean(currentGroup) !== true}>Add Entry</button>
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
      </div>
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
