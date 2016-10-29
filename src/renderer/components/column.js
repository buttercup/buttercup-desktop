import React, { PropTypes } from 'react';
import { style, merge } from 'glamor';
import { flex, stretch } from './styles';

const Column = ({children, footer = null, header = null, className = null}) => (
  <div className={merge(styles.column, className)}>
    {header && <header className={styles.bar}>
      {header}
    </header>}
    <section className={stretch}>
    {children}
    </section>
    <footer className={styles.bar}>
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
  column: merge(flex, {flexDirection: 'column'}),
  bar: style({
    flex: '0 0 40px'
  })
};

export default Column;
