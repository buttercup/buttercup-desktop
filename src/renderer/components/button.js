import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from '../styles/button';

const Button = ({children, full, primary, secondary, danger, disabled, dark, className, icon, ...rest}) => (
  <button
    className={cx(
      styles.button,
      full && styles.full,
      primary && styles.primary,
      secondary && styles.secondary,
      danger && styles.danger,
      dark && styles.dark,
      !children && styles.icon,
      className
    )}
    {...rest}
    disabled={disabled}
    >
    {icon}{children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  full: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  danger: PropTypes.bool,
  dark: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.object
};

export default Button;
