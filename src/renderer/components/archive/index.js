import React from 'react';
import SplitPane from 'react-split-pane';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';
import styles from '../styles/commons.scss';

export default () => (
  <section className={styles.flexContainer}>
    <SplitPane split="vertical" defaultSize={200} minSize={200} maxSize={500}>
      <TreeView/>
      <SplitPane split="vertical" defaultSize={250} minSize={250} maxSize={500}>
        <Entries/>
        <Entry/>
      </SplitPane>
    </SplitPane>
  </section>
);
