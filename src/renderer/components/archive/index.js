import React from 'react';
import TreeView from '../../containers/tree-view';
import Entries from '../../containers/archive/entries';
import Entry from '../../containers/archive/entry';
import styles from '../styles/commons.scss';

export default () => (
  <section className={styles.flexContainer}>
    <TreeView/>
    <Entries/>
    <Entry/>
  </section>
);
