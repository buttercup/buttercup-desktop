import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import PlusIcon from 'react-icons/lib/md/add';
import RemoveIcon from 'react-icons/lib/fa/trash-o';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
import { Button } from '@buttercup/ui';
import Heading from './heading';
import Input from './entry-input';
import EntryIcon from './entry-icon';
import { LabelWrapper, MetaWrapper, Row } from './entry-view';

function getPlaceholder(propertyName) {
  switch (propertyName) {
    case 'title':
      return 'entry.untitled';
    case 'username':
      return 'entry.username';
    case 'password':
      return 'entry.secure-password';
    default:
      return 'entry.new-field';
  }
}

function shouldShowSeparator(index, field, fields) {
  if (
    (field.removeable === false && index === fields.length - 1) ||
    (field.removeable === false && fields.get(index + 1).removeable === true)
  ) {
    return true;
  }
  return false;
}

const renderMeta = (
  { fields, t, entry, meta: { touched, error } } // eslint-disable-line react/prop-types
) => (
  <>
    <MetaWrapper>
      {fields.map((member, index) => {
        const field = fields.get(index);
        const isTitle =
          field.property === 'title' && field.removeable === false;
        return (
          <Fragment key={index}>
            <Row>
              <LabelWrapper>
                <Choose>
                  <When condition={isTitle}>
                    <EntryIcon entry={entry} big />
                  </When>
                  <When condition={field.removeable}>
                    <Field
                      name={`${member}.property`}
                      type="text"
                      component="input"
                      placeholder={t('entry.label')}
                    />
                  </When>
                  <Otherwise>
                    <Translate
                      i18nKey={`entry.${field.property}`}
                      parent="span"
                    />
                  </Otherwise>
                </Choose>
              </LabelWrapper>
              <Field
                name={`${member}.value`}
                type={field.secret ? 'password' : 'text'}
                component={Input}
                placeholder={t(getPlaceholder(field.property))}
                isBig={isTitle}
              />
              <If condition={field.removeable}>
                <Button
                  onClick={() => fields.remove(index)}
                  icon={<RemoveIcon />}
                />
              </If>
            </Row>
            <If condition={shouldShowSeparator(index, field, fields)}>
              <Translate i18nKey="entry.custom-fields" parent={Heading} />
            </If>
          </Fragment>
        );
      })}
    </MetaWrapper>
    <Button
      onClick={e => {
        fields.push({
          title: '',
          removeable: true,
          field: 'property',
          secret: false,
          multiline: false,
          formatting: false
        });
        e.stopPropagation();
        e.preventDefault();
      }}
      icon={<PlusIcon />}
    >
      <Translate i18nKey="entry.add-new-field" parent="span" />
    </Button>
    {touched && error && <span>{error}</span>}
  </>
);

renderMeta.propTypes = {
  fields: PropTypes.array
};

class EntryForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    entry: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const { entry, handleSubmit, t } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FieldArray
          name="facade.fields"
          component={renderMeta}
          t={t}
          entry={entry}
        />
      </form>
    );
  }
}

export default translate()(EntryForm);
