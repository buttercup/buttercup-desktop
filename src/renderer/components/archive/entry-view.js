import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Heading from './heading';
import bubbleImage from '../../styles/img/info-bubble.svg';
import { Translate } from '../../../shared/i18n';
import EmptyView from '../empty-view';
import Copyable from './copyable';
import EntryIcon from './entry-icon';
import { Wrapper } from './entry-input';

const getNonRemoveableFields = fieldsArr =>
  fieldsArr.filter(field => !field.removeable);
const getRemoveableFields = fieldsArr =>
  fieldsArr.filter(field => field.removeable);

export const LabelWrapper = styled.label`
  flex: 0 0 130px;
  min-height: var(--form-input-height);
  border-right: 1px solid var(--black-10);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  text-align: right;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75em;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  input {
    width: 100%;
    border: none;
    text-align: right;
  }
`;

export const MetaWrapper = styled.div`
  margin-bottom: var(--spacing-one);
`;

export const Row = styled(Flex)`
  padding: var(--spacing-half) 0;
  border-bottom: 1px solid var(--black-10);
`;

const FieldsView = ({ fields, entry, t }) => (
  <For each="field" of={fields}>
    <Row key={field.property}>
      <LabelWrapper>
        <Choose>
          <When condition={field.property === 'title'}>
            <EntryIcon entry={entry} big />
          </When>
          <When condition={field.removeable === false}>
            {t(`entry.${field.property}`)}
          </When>
          <Otherwise>{field.property}</Otherwise>
        </Choose>
      </LabelWrapper>
      <Wrapper
        isTitle={field.property === 'title' && field.removeable === false}
      >
        <Copyable isSecret={field.secret}>{field.value}</Copyable>
      </Wrapper>
    </Row>
  </For>
);

FieldsView.propTypes = {
  entry: PropTypes.object,
  fields: PropTypes.array,
  t: PropTypes.func
};

const EntryView = props => {
  const { entry, t } = props;
  return (
    <>
      <FieldsView
        {...props}
        fields={getNonRemoveableFields(entry.facade.fields)}
      />
      <Translate i18nKey="entry.custom-fields" parent={Heading} />
      <With fields={getRemoveableFields(entry.facade.fields)}>
        <Choose>
          <When condition={fields.length > 0}>
            <FieldsView {...props} fields={fields} />
          </When>
          <Otherwise>
            <EmptyView
              caption={t('entry.no-custom-fields-info-text')}
              imageSrc={bubbleImage}
            />
          </Otherwise>
        </Choose>
      </With>
    </>
  );
};

EntryView.propTypes = {
  entry: PropTypes.object,
  t: PropTypes.func
};

export default translate()(EntryView);
