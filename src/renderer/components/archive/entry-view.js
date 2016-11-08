import React, { PropTypes } from 'react';
import { formRow, metaWrapper, heading, labelWrapper } from '../../styles/entry-form';
import { wrapper as inputWrapper } from '../../styles/entry-input';
import Copyable from './copyable';

const EntryView = ({entry}) => (
  <div>
    {['title', 'username', 'password'].map(key => (
      <div className={formRow} key={key}>
        <div className={labelWrapper}>{key}</div>
        <div className={inputWrapper}>
          <Copyable type={key}>{entry.properties[key]}</Copyable>
        </div>
      </div>
    ))}
    <h6 className={heading}>Custom Fields:</h6>
    <div className={metaWrapper}>
      {entry.meta.map(meta => (
        <div className={formRow} key={meta.key}>
          <div className={labelWrapper}>{meta.key}</div>
          <div className={inputWrapper}>
            <Copyable>{meta.value}</Copyable>
          </div>
        </div>
      ))}
    </div>
  </div>
);

EntryView.propTypes = {
  entry: PropTypes.object
};

export default EntryView;
