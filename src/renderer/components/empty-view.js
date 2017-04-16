import React, { PropTypes } from 'react';
import styles from '../styles/empty-view';

const EmptyView = ({ caption, imageSrc }) => {
  return (
    <div className={styles.wrapper}>
      <figure>
        {imageSrc && <img src={imageSrc} />}
        <figcaption className={styles.caption}>{caption}</figcaption>
      </figure>
    </div>
  );
};

EmptyView.propTypes = {
  caption: PropTypes.string,
  imageSrc: PropTypes.string
};

export default EmptyView;
