import React, { Component, PropTypes } from 'react';
import EntryForm from '../../containers/archive/entry-form';
import { showConfirmDialog } from '../../system/dialog';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.onSave(values);
  }

  handleDeleteClick(id) {
    showConfirmDialog('Are you sure?', resp => {
      if (resp === 0) {
        this.props.onDelete(id);
      }
    });
  }

  render() {
    let showForm = false;
    if (this.props.entry) {
      showForm = true;
    }
    
    return (
      <div>
        {showForm && <EntryForm onSubmit={this.handleSubmit}/>}
        {showForm && <button onClick={() => this.handleDeleteClick(this.props.entry.id)}>Delete</button>}
      </div>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object,
  onSave: PropTypes.func,
  onDelete: PropTypes.func
};

export default Entry;
