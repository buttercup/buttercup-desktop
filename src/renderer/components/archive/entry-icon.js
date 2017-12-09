import PropTypes from 'prop-types';
import React from 'react';
import styles from '../../styles/entry-icon';
import defaultIcon from '../../styles/img/lock-black.svg';

const EntryIcon = props => {
  const style = {
    backgroundImage: `url(${props.icon ? props.icon : defaultIcon})`
  };
  const className = [styles.entryIcon, props.big ? styles.big : ''].join(' ');

  return <div className={className} style={style} />;
};

EntryIcon.propTypes = {
  big: PropTypes.bool,
  icon: PropTypes.string
};

export default EntryIcon;
