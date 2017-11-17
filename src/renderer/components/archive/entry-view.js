import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import {
  formRow,
  metaWrapper,
  heading,
  labelWrapper
} from '../../styles/entry-form';
import { wrapper as inputWrapper } from '../../styles/entry-input';
import bubbleImage from '../../styles/img/info-bubble.svg';
import EmptyView from '../empty-view';
import Copyable from './copyable';

const EntryView = ({ entry, intl }) => (
  <div>
    {['title', 'username', 'password'].map(key => (
      <div className={formRow} key={key}>
        <div className={labelWrapper}>
          <FormattedMessage id={key} defaultMessage={key} />
        </div>
        <div className={inputWrapper}>
          <Copyable type={key}>{entry.properties[key]}</Copyable>
        </div>
      </div>
    ))}
    <h6 className={heading}>
      <FormattedMessage id="custom-fields" defaultMessage="Custom Fields" />:
    </h6>
    {entry.meta.length > 0 ? (
      <div className={metaWrapper}>
        {entry.meta.map(meta => (
          <If condition={Object.keys(meta).length > 0}>
            <div className={formRow} key={meta.key}>
              <div className={labelWrapper}>{meta.key}</div>
              <div className={inputWrapper}>
                <Copyable>{meta.value}</Copyable>
              </div>
            </div>
          </If>
        ))}
      </div>
    ) : (
      <EmptyView
        caption={intl.formatMessage({
          id: 'no-custom-fields-info-text',
          defaultMessage: 'No custom fields yet. Why not add one?'
        })}
        imageSrc={bubbleImage}
      />
    )}
  </div>
);

EntryView.propTypes = {
  entry: PropTypes.object,
  intl: intlShape.isRequired
};

export default injectIntl(EntryView);
