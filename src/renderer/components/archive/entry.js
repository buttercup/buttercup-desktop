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
    let showForm = false;
    if (this.props.entry) {
      showForm = true;
    }
    
    return (
      <div>
        {showForm && <EntryForm onSubmit={this.handleSubmit}/>}
      </div>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object,
  onSave: PropTypes.func
};

export default Entry;
