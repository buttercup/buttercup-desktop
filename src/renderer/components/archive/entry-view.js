import React, { PropTypes } from 'react';

const EntryView = ({entry}) => (
  <div>
    <span>Title: {entry.properties.title}</span><br/>
    <span>Username: {entry.properties.username}</span><br/>
    <span>Password: {entry.properties.password}</span><br/>
    <ul>
      {entry.meta.map(meta => (<li key={meta.key}>{meta.key}: {meta.value}</li>))}
    </ul>
  </div>
);

EntryView.propTypes = {
  entry: PropTypes.object
};

export default EntryView;
