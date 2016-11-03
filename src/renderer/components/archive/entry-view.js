import React, { PropTypes } from 'react';
import { formRow, metaWrapper, heading } from '../styles';
import Copyable from './copyable';

const EntryView = ({entry}) => (
  <div>
    {['title', 'username', 'password'].map(key => (
      <div className={formRow} key={key}>
        <div className="label-wrapper">{key}</div>
        <div className="input-wrapper">
          <Copyable type={key}>{entry.properties[key]}</Copyable>
        </div>
      </div>
    ))}
    <h6 className={heading}>Custom Fields:</h6>
    <div className={metaWrapper}>
      {entry.meta.map(meta => (
        <div className={formRow} key={meta.key}>
          <div className="label-wrapper">{meta.key}</div>
          <div className="input-wrapper">
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
