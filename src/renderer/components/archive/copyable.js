import React, { PropTypes } from 'react';
import { clipboard } from 'electron';
import { style, merge, $ } from 'glamor';
import { spacing, colors } from '../styles/variables';

const Copyable = ({children}) => (
  <span className={styles.span}>
    <span>{children}</span>
    <button className={styles.button} onClick={() => clipboard.writeText(children)}>Copy</button>
  </span>
);

Copyable.propTypes = {
  children: PropTypes.node
};

const styles = {
  span: merge(
    style({
      display: 'inline-block',
      border: `1px dashed transparent`,
      height: spacing.FORM_COPYABLE_HEIGHT,
      lineHeight: spacing.FORM_COPYABLE_HEIGHT,
      margin: `${spacing.FORM_COPYABLE_MARGIN} 0`,
      paddingLeft: spacing.HALF,
      borderRadius: '5px',
      ':hover': {
        borderColor: colors.BLACK_25
      }
    }),
    $(':hover button', {
      display: 'inline-block'
    })
  ),
  button: style({
    height: '20px',
    lineHeight: 1,
    fontSize: '10px',
    verticalAlign: 'top',
    padding: '0 5px',
    marginLeft: spacing.HALF,
    display: 'none',
    cursor: 'pointer'
  })
};

export default Copyable;
