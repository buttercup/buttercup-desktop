import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import styles from '../styles/icon';

const Icon = ({ name, size = 32 }) => {
  let className = `icon-${name}`;

  if (!(className in styles)) {
    className = 'icon-document';
  }

  return (
    <i
      className={cx(styles.icon, styles[className])}
      style={{ fontSize: `${size}px` }}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

export default Icon;
