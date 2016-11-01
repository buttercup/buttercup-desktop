import React, { Component, PropTypes } from 'react';
import { style, merge } from 'glamor';
import TrashIcon from 'react-icons/lib/fa/trash-o';
import EditIcon from 'react-icons/lib/fa/edit';
import EntryForm from '../../containers/archive/entry-form';
import { showConfirmDialog } from '../../system/dialog';
import { flex } from '../styles';
import Column from '../column';
import Button from '../button';
import EntryView from './entry-view';
import EmptyView from './entry-empty';

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
    return {
      content: <EntryForm
        onSubmit={values => this.props.onEditEntry(values)}
        onCancel={this.props.handleViewMode}
        onDelete={() => this.handleDeleteClick(this.props.entry.id)}
        />,
      footer: (
        <div className={flex}>
          <div className={styles.split}>
            <Button onClick={this.props.handleViewMode} secondary>
              Cancel
            </Button>
          </div>
          <div className={styles.splitRight}>
            <Button
              onClick={() => this.handleDeleteClick(this.props.entry.id)}
              icon={<TrashIcon/>}
              danger
              >Delete</Button>
          </div>
        </div>
      )
    };
  }

  renderNewMode() {
    return {
      content: <EntryForm
        onSubmit={values => this.props.onNewEntry(values)}
        onCancel={this.props.handleViewMode}
        />,
      footer: null
    };
  }

  renderViewMode() {
    return {
      content: <EntryView entry={this.props.entry}/>,
      footer: <Button onClick={this.props.handleEditMode} secondary icon={<EditIcon/>}>Edit</Button>
    };
  }

  renderIdleMode() {
    return {
      content: <EmptyView/>,
      footer: null
    };
  }

  render() {
    const { entry, mode } = this.props;
    let fn = null;

    if (entry && mode !== 'new') {
      if (mode === 'edit') {
        fn = this.renderEditMode;
      } else if (mode === 'view') {
        fn = this.renderViewMode;
      }
    } else if (!entry && mode === 'new') {
      fn = this.renderNewMode;
    } else {
      fn = this.renderIdleMode;
    }

    const { content, footer } = fn.call(this);

    return (
      <Column light footer={footer}>
        {content}
      </Column>
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

const styles = {
  split: style({
    flex: '0 0 50%'
  }),
  splitRight: merge(
    flex,
    {
      flex: '0 0 50%',
      justifyContent: 'flex-end'
    }
  )
};

export default Entry;
