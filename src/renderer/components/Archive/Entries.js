import React, { Component, PropTypes } from 'react';

class Entries extends Component {
  render() {
    return (
      <ul>
        {this.props.entries.map(entry => 
          <li key={entry.id}>
            <strong>{entry.properties.title}</strong>
            <br/>{entry.properties.username}
          </li>
        )}
      </ul>
    );
  }
}

Entries.propTypes = {
  entries: PropTypes.array
};

export default Entries;
