import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TrashIcon from 'react-icons/lib/fa/trash-o';
import EditIcon from 'react-icons/lib/fa/edit';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Button } from '@buttercup/ui';
import EntryForm from '../../containers/archive/entry-form';
import styles from '../../styles/entry';
import Column from '../column';
import EmptyView from '../empty-view';
import bench from '../../styles/img/bench.svg';
import EntryView from './entry-view';

class Entry extends Component {
  static propTypes = {
    dirty: PropTypes.bool,
    mode: PropTypes.string,
    entry: PropTypes.object,
    onEditEntry: PropTypes.func,
    onNewEntry: PropTypes.func,
    onDelete: PropTypes.func,
    handleEditMode: PropTypes.func,
    handleViewMode: PropTypes.func,
    initializeForm: PropTypes.func,
    intl: intlShape.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const { mode, entry, initializeForm } = this.props;
    if (nextProps.mode !== mode) {
      if (nextProps.mode === 'edit' && entry) {
        initializeForm(entry);
      }
    }
  }

  renderEditMode() {
    let ref;
    return {
      content: (
        <EntryForm
          ref={form => {
            ref = form;
          }}
          onSubmit={values => this.props.onEditEntry(values)}
        />
      ),
      footer: (
        <div className={styles.splitter}>
          <div>
            <Button
              onClick={() => ref.submit()}
              disabled={!this.props.dirty}
              primary
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>{' '}
            <Button onClick={this.props.handleViewMode}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </div>
          <div>
            <Button
              onClick={() => this.props.onDelete(this.props.entry.id)}
              icon={<TrashIcon />}
              danger
            >
              <FormattedMessage id="delete" defaultMessage="Delete" />
            </Button>
          </div>
        </div>
      )
    };
  }

  renderNewMode() {
    let ref;
    return {
      content: (
        <EntryForm
          ref={form => {
            ref = form;
          }}
          onSubmit={values => this.props.onNewEntry(values)}
        />
      ),
      footer: (
        <div>
          <Button
            onClick={() => ref.submit()}
            disabled={!this.props.dirty}
            primary
          >
            <FormattedMessage id="save" defaultMessage="Save" />
          </Button>{' '}
          <Button onClick={this.props.handleViewMode}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </div>
      )
    };
  }

  renderViewMode() {
    return {
      content: <EntryView entry={this.props.entry} />,
      footer: (
        <Button onClick={this.props.handleEditMode} icon={<EditIcon />}>
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </Button>
      )
    };
  }

  renderIdleMode() {
    const { intl } = this.props;

    return {
      content: (
        <EmptyView
          caption={intl.formatMessage({
            id: 'select-or-create-an-entry',
            defaultMessage: 'Select or Create an Entry'
          })}
          className={styles.emptyView}
          imageSrc={bench}
        />
      ),
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
      <Column
        light
        footer={footer}
        className={styles.column}
        contentClassName={styles.content}
      >
        {content}
      </Column>
    );
  }
}

export default injectIntl(Entry);
