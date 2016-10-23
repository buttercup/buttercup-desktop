import React, { Component, PropTypes } from 'react';
import EntryForm from '../../containers/archive/entry-form';

class Entry extends Component {
  handleSubmit(values) {
    console.log(values);
  }

  render() {
    if (!this.props.entry) {
      return null;
    }
    
    return (
      <EntryForm onSubmit={this.handleSubmit}/>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object
};

export default Entry;
