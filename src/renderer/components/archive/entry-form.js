import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Button } from '@buttercup/ui';
import styles from '../../styles/entry-form';
import Input from './entry-input';

const renderMeta = (
  { fields, meta: { touched, error } } // eslint-disable-line react/prop-types
) => (
  <div>
    <div className={styles.metaWrapper}>
      {fields.map((member, index) => (
        <div className={styles.formRow} key={index}>
          <div className={styles.labelWrapper}>
            <Field
              name={`${member}.key`}
              type="text"
              component="input"
              placeholder="Label"
            />
          </div>
          <Field
            name={`${member}.value`}
            type="text"
            component={Input}
            placeholder="New Field"
          />
          <Button onClick={() => fields.remove(index)} icon={<RemoveIcon />} />
        </div>
      ))}
    </div>
    <Button
      onClick={e => {
        fields.push({});
        e.stopPropagation();
        e.preventDefault();
      }}
      icon={<PlusIcon />}
    >
      <FormattedMessage id="add-new-field" defaultMessage="Add New Field" />
    </Button>
    {touched && error && <span>{error}</span>}
  </div>
);

class EntryForm extends Component {
  render() {
    const { handleSubmit, intl } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.title">
            <FormattedMessage id="title" defaultMessage="Title" />
          </label>
          <Field
            name="properties.title"
            component={Input}
            type="text"
            placeholder={intl.formatMessage({
              id: 'untitled',
              defaultMessage: 'Untitled'
            })}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.username">
            <FormattedMessage id="username" defaultMessage="Username" />
          </label>
          <Field
            name="properties.username"
            component={Input}
            type="text"
            placeholder={
              '@' +
              intl.formatMessage({
                id: 'username',
                defaultMessage: 'Username'
              }) +
              '...'
            }
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.password">
            <FormattedMessage id="password" defaultMessage="Password" />
          </label>
          <Field
            name="properties.password"
            component={Input}
            type="password"
            placeholder={
              intl.formatMessage({
                id: 'secure-password',
                defaultMessage: 'Secure password'
              }) + '...'
            }
          />
        </div>
        <h6 className={styles.heading}>
          <FormattedMessage
            id="custom-fields"
            defaultMessage="Custom Fields"
          />:
        </h6>
        <FieldArray name="meta" component={renderMeta} />
      </form>
    );
  }
}

EntryForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired
};

export default injectIntl(EntryForm);
