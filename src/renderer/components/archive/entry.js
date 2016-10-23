import React, { Component, PropTypes } from 'react';
import EntryForm from '../../containers/archive/entry-form';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.onSave(values);
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
  entry: PropTypes.object,
  onSave: PropTypes.func
};

export default Entry;
