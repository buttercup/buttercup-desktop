import React from 'react';
import { style, merge } from 'glamor';
import { flex } from '../styles';
import bench from '../styles/img/bench.svg';

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

const styles = {
  wrapper: merge(
    flex,
    {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
  ),
  caption: style({
    color: '#777',
    fontWeight: 300
  })
};

export default EntryEmptyView;
