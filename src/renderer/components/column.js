import React, { PropTypes } from 'react';
import { style, merge } from 'glamor';
import { flex, stretch } from './styles';
import { spacing } from './styles/variables';

const Column = ({children, footer = null, header = null, className = null}) => (
  <div className={merge(styles.column, className)}>
    {header && <header className={merge(styles.bar, styles.header)}>
      {header}
    </header>}
    <section className={stretch}>
    {children}
    </section>
    <footer className={merge(styles.bar, styles.footer)}>
      {footer}
    </footer>
  </div>
);

Column.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.object
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
