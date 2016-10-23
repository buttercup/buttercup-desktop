import React from 'react';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';

export default () => (
  <div>
    <TreeView/>
    <Entries/>
    <Entry/>
  </div>
);
