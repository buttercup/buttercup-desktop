import React, { Component, PropTypes } from 'react';
import EntryForm from '../../containers/archive/entry-form';
import { showConfirmDialog } from '../../system/dialog';

class Entry extends Component {
  handleDeleteClick(id) {
    showConfirmDialog('Are you sure?', resp => {
      if (resp === 0) {
        this.props.onDelete(id);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { mode, entry, initializeForm } = this.props;
    if (nextProps.mode !== mode) {
      if (nextProps.mode === 'edit' && entry) {
        initializeForm(entry);
      }
    }
  }

  renderEditMode() {
    return (
      <div>
        <EntryForm onSubmit={values => this.props.onEditEntry(values)}/>
        <button onClick={() => this.handleDeleteClick(this.props.entry.id)}>Delete</button>
        <button onClick={this.props.handleViewMode}>Cancel</button>
      </div>
    );
  }

  renderViewMode() {
    return (
      <div>
        <button onClick={this.props.handleEditMode}>Edit</button>
      </div>
    );
  }

  render() {
    const { entry, mode } = this.props;
    let content = null;

    if (entry) {
      if (mode === 'edit') {
        content = this.renderEditMode();
      } else if (mode === 'view') {
        content = this.renderViewMode();
      }
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

Entry.propTypes = {
  mode: PropTypes.string,
  entry: PropTypes.object,
  onEditEntry: PropTypes.func,
  onDelete: PropTypes.func,
  handleEditMode: PropTypes.func,
  handleViewMode: PropTypes.func,
  initializeForm: PropTypes.func
};

export default Entry;
