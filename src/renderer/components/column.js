import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './styles/commons.scss';
import localStyles from './styles/column.scss';

const Column = ({children, className = [], footer = null, header = null}) => (
  <div className={cx([styles.flexColumn, ...className, localStyles.column])}>
    {header && <header>
      {header}
    </header>}
    <section className={localStyles.content}>
    {children}
    </section>
    <footer>
      {footer}
    </footer>
  </div>
);

Column.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.array
};

export default Column;
