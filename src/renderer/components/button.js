import React, { PropTypes } from 'react';
import { style, merge, $ } from 'glamor';
import { spacing, colors } from './styles/variables';

const Button = ({children, full, primary, secondary, danger, disabled, dark, className, icon, ...rest}) => (
  <button
    className={merge(
      styles.button,
      full && styles.full,
      primary && styles.primary,
      secondary && styles.secondary,
      danger && styles.danger,
      dark && styles.dark,
      disabled && styles.disabled,
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

const styles = {
  button: merge(
    style({
      display: 'inline-block',
      borderRadius: '20px',
      fontSize: '.75em',
      textTransform: 'uppercase',
      padding: `${spacing.HALF} ${spacing.ONE}`,
      border: 0,
      cursor: 'pointer !important',
      outline: 'none',
      transition: 'background-color .2s ease',
      backgroundColor: colors.GRAY_LIGHT,
      ':hover': {
        backgroundColor: colors.GRAY_LIGHT_DARKER
      }
    }),
    $(' svg', {
      fontSize: '14px',
      verticalAlign: '-3px !important',
      marginRight: '2px',
      cursor: 'pointer !important'
    })
  ),
  full: style({
    width: '100%'
  }),
  disabled: style({
    opacity: 0.5,
    cursor: 'default'
  }),
  primary: style({
    backgroundColor: colors.BRAND_PRIMARY,
    color: '#fff',
    ':hover': {
      backgroundColor: colors.BRAND_PRIMARY_DARKER
    }
  }),
  secondary: style({
    
  }),
  dark: style({
    backgroundColor: colors.BLACK_25,
    color: '#fff',
    ':hover': {
      backgroundColor: colors.BLACK_35
    }
  }),
  danger: style({
    backgroundColor: colors.RED,
    color: '#fff',
    ':hover': {
      backgroundColor: colors.RED_DARKER
    }
  }),
  icon: style({
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    padding: `${spacing.HALF} 0`
  })
};

export default Button;
