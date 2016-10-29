import React from 'react';
import SplitPane from 'react-split-pane';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';
import '../styles/split-pane.global.scss';

export default () => (
  <SplitPane split="vertical" defaultSize={230} minSize={230} maxSize={500}>
    <TreeView/>
    <SplitPane split="vertical" defaultSize={230} minSize={230} maxSize={500}>
      <Entries/>
      <Entry/>
    </SplitPane>
  </SplitPane>
);
