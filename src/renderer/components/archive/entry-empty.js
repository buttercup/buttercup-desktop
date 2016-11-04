import React from 'react';
import styles from '../../styles/entry-empty';
import bench from '../../styles/img/bench.svg';

const EntryEmptyView = () => {
  return (
    <div className={styles.wrapper}>
      <figure>
        <img src={bench}/>
        <figcaption className={styles.caption}>Select or Create an Entry</figcaption>
      </figure>
    </div>
  );
};

export default EntryEmptyView;
