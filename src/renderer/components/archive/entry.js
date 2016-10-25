import React, { Component, PropTypes } from 'react';
import EntryForm from '../../containers/archive/entry-form';
import { showConfirmDialog } from '../../system/dialog';
import EntryView from './entry-view';

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
      <EntryForm
        onSubmit={values => this.props.onEditEntry(values)}
        onCancel={this.props.handleViewMode}
        onDelete={() => this.handleDeleteClick(this.props.entry.id)}
        />
    );
  }

  renderNewMode() {
    return (
      <EntryForm
        onSubmit={values => this.props.onNewEntry(values)}
        onCancel={this.props.handleViewMode}
        />
    );
  }

  renderViewMode() {
    return (
      <div>
        <EntryView entry={this.props.entry}/>
        <button onClick={this.props.handleEditMode}>Edit</button>
      </div>
    );
  }

  render() {
    const { entry, mode } = this.props;
    let content = null;

    if (entry && mode !== 'new') {
      if (mode === 'edit') {
        content = this.renderEditMode();
      } else if (mode === 'view') {
        content = this.renderViewMode();
      }
    } else if (!entry && mode === 'new') {
      content = this.renderNewMode();
    }

    return (
      <div>
        <hr/>
        {content}
      </div>
    );
  }
}

Entry.propTypes = {
  mode: PropTypes.string,
  entry: PropTypes.object,
  onEditEntry: PropTypes.func,
  onNewEntry: PropTypes.func,
  onDelete: PropTypes.func,
  handleEditMode: PropTypes.func,
  handleViewMode: PropTypes.func,
  initializeForm: PropTypes.func
};

export default Entry;
