import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TrashIcon from 'react-icons/lib/fa/trash-o';
import EditIcon from 'react-icons/lib/fa/edit';
import { translate } from 'react-i18next';
import { Button } from '@buttercup/ui';
import { Translate } from '../../../shared/i18n';
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
    t: PropTypes.func
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
              <Translate i18nKey="save" parent="span" />
            </Button>{' '}
            <Button onClick={this.props.handleViewMode}>
              <Translate i18nKey="cancel" parent="span" />
            </Button>
          </div>
          <div>
            <Button
              onClick={() => this.props.onDelete(this.props.entry.id)}
              icon={<TrashIcon />}
              danger
            >
              <Translate i18nKey="delete" parent="span" />
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
            <Translate i18nKey="save" parent="span" />
          </Button>{' '}
          <Button onClick={this.props.handleViewMode}>
            {' '}
            <Translate i18nKey="cancel" parent="span" />
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
          <Translate i18nKey="edit" parent="span" />
        </Button>
      )
    };
  }

  renderIdleMode() {
    const { t } = this.props;

    return {
      content: (
        <EmptyView
          caption={t('select-or-create-an-entry')}
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

export default translate()(Entry);
