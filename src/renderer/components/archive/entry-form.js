import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
import { Button } from '@buttercup/ui';
import { heading } from '../../styles/_common';
import Input from './entry-input';
import EntryIcon from './entry-icon';
import { LabelWrapper, MetaWrapper, Row } from './entry-view';

const renderMeta = (
  { fields, t, meta: { touched, error } } // eslint-disable-line react/prop-types
) => (
  <div>
    <MetaWrapper>
      {fields.map((member, index) => (
        <Row key={index}>
          <LabelWrapper>
            <Field
              name={`${member}.key`}
              type="text"
              component="input"
              placeholder={t('entry.label')}
            />
          </LabelWrapper>
          <Field
            name={`${member}.value`}
            type="text"
            component={Input}
            placeholder={t('entry.new-field')}
          />
          <Button onClick={() => fields.remove(index)} icon={<RemoveIcon />} />
        </Row>
      ))}
    </MetaWrapper>
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

class EntryForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    icon: PropTypes.string,
    t: PropTypes.func
  };

  render() {
    const { icon, handleSubmit, t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <LabelWrapper htmlFor="properties.title">
            <EntryIcon icon={icon} big />
          </LabelWrapper>
          <Field
            name="properties.title"
            component={Input}
            type="text"
            placeholder={t('entry.untitled')}
          />
        </Row>
        <Row>
          <LabelWrapper htmlFor="properties.username">
            <Translate i18nKey="entry.username" parent="span" />
          </LabelWrapper>
          <Field
            name="properties.username"
            component={Input}
            type="text"
            placeholder={'@' + t('entry.username') + '...'}
          />
        </Row>
        <Row>
          <LabelWrapper htmlFor="properties.password">
            <Translate i18nKey="entry.password" parent="span" />
          </LabelWrapper>
          <Field
            name="properties.password"
            component={Input}
            type="password"
            placeholder={t('entry.secure-password') + '...'}
          />
        </Row>
        <h6 className={heading}>
          {' '}
          <Translate i18nKey="entry.custom-fields" parent="span" />:
        </h6>
        <FieldArray name="meta" component={renderMeta} t={t} />
      </form>
    );
  }
}

export default translate()(EntryForm);
