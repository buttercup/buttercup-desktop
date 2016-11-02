import React, { PropTypes } from 'react';
import { style, merge } from 'glamor';
import { flex, stretch } from './styles';
import { spacing } from './styles/variables';

const Column = ({
  children,
  footer = null,
  header = null,
  className = null,
  contentClassName = null,
  light = false
}) => (
  <div className={merge(styles.column, className)}>
    {header && <header className={merge(styles.bar, styles.header)}>
      {header}
    </header>}
    <section className={merge(stretch, contentClassName)}>
    {children}
    </section>
    {footer && <footer className={merge(styles.bar, styles.footer, light && {borderColor: 'rgba(0,0,0,.05)'})}>
      {footer}
    </footer>}
  </div>
);

Column.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.object,
  contentClassName: PropTypes.object,
  light: PropTypes.bool
};

const styles = {
  column: merge(flex, {flexDirection: 'column', width: '100%'}),
  bar: style({
    border: '0 solid rgba(255,255,255,.05)',
    flex: 0,
    padding: spacing.ONE
  }),
  header: style({
    borderBottomWidth: '1px'
  }),
  footer: style({
    borderTopWidth: '1px'
  })
};

export default Column;
