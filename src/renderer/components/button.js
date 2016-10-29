import React, { PropTypes } from 'react';
import { style, merge } from 'glamor';
import { spacing, colors } from './styles/variables';

const Button = ({children, full, primary, secondary, disabled, ...rest}) => (
  <button
    className={merge(
      styles.button,
      full && styles.full,
      primary && styles.primary,
      secondary && styles.secondary,
      disabled && styles.disabled
    )}
    {...rest}
    disabled={disabled}
    >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  full: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool
};

const styles = {
  button: style({
    display: 'inline-block',
    borderRadius: '20px',
    fontSize: '.8em',
    textTransform: 'uppercase',
    padding: `${spacing.HALF} ${spacing.ONE}`,
    border: 0,
    cursor: 'pointer',
    outline: 'none'
  }),
  full: style({
    width: '100%'
  }),
  disabled: style({
    opacity: 0.5
  }),
  primary: style({
    backgroundColor: 'rgba(0,0,0,.25)'
  }),
  secondary: style({
    backgroundColor: 'rgba(0,0,0,.25)'
  })
};

export default Button;
