import PropTypes from 'prop-types';
import React from 'react';
import { translate } from 'react-i18next';
import {
  formRow,
  metaWrapper,
  heading,
  labelWrapper
} from '../../styles/entry-form';
import bubbleImage from '../../styles/img/info-bubble.svg';
import { Translate } from '../../../shared/i18n';
import EmptyView from '../empty-view';
import Copyable from './copyable';
import { Wrapper } from './entry-input';

const EntryView = ({ entry, t }) => (
  <div>
    {['title', 'username', 'password'].map(key => (
      <div className={formRow} key={key}>
        <div className={labelWrapper}>{t(key)}</div>
        <Wrapper>
          <Copyable type={key}>{entry.properties[key]}</Copyable>
        </Wrapper>
      </div>
    ))}
    <h6 className={heading}>
      <Translate i18nKey="entry.custom-fields" parent="span" />:
    </h6>
    {entry.meta.length > 0 ? (
      <div className={metaWrapper}>
        {entry.meta.map(meta => (
          <If condition={Object.keys(meta).length > 0}>
            <div className={formRow} key={meta.key}>
              <div className={labelWrapper}>{meta.key}</div>
              <Wrapper>
                <Copyable>{meta.value}</Copyable>
              </Wrapper>
            </div>
          </If>
        ))}
      </div>
    ) : (
      <EmptyView
        caption={t('entry.no-custom-fields-info-text')}
        imageSrc={bubbleImage}
      />
    )}
  </div>
);

EntryView.propTypes = {
  entry: PropTypes.object,
  t: PropTypes.func
};

export default translate()(EntryView);
