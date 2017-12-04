import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
import { Button } from '@buttercup/ui';
import styles from '../../styles/entry-form';
import Input from './entry-input';

const renderMeta = (
  { fields, t, meta: { touched, error } } // eslint-disable-line react/prop-types
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
              placeholder={t('entry.label')}
            />
          </div>
          <Field
            name={`${member}.value`}
            type="text"
            component={Input}
            placeholder={t('entry.new-field')}
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
      <Translate i18nKey="entry.add-new-field" parent="span" />
    </Button>
    {touched && error && <span>{error}</span>}
  </div>
);

class EntryForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const { handleSubmit, t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.title">
            <Translate i18nKey="entry.title" parent="span" />
          </label>
          <Field
            name="properties.title"
            component={Input}
            type="text"
            placeholder={t('entry.untitled')}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.username">
            <Translate i18nKey="entry.username" parent="span" />
          </label>
          <Field
            name="properties.username"
            component={Input}
            type="text"
            placeholder={'@' + t('entry.username') + '...'}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.labelWrapper} htmlFor="properties.password">
            <Translate i18nKey="entry.password" parent="span" />
          </label>
          <Field
            name="properties.password"
            component={Input}
            type="password"
            placeholder={t('entry.secure-password') + '...'}
          />
        </div>
        <h6 className={styles.heading}>
          {' '}
          <Translate i18nKey="entry.custom-fields" parent="span" />:
        </h6>
        <FieldArray name="meta" component={renderMeta} t={t} />
      </form>
    );
  }
}

export default translate()(EntryForm);
