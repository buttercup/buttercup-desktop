import React, { Component, PropTypes } from 'react';

class Entry extends Component {
  render() {
    return (
      <pre>{JSON.stringify(this.props.entry, undefined, 2)}</pre>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object
};

export default Entry;
