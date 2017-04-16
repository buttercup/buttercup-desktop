import React, { PropTypes } from 'react';
import styles from '../styles/update-notice';

const UpdateNotice = ({available, version, installing, onClick}) => {
  if (!available) {
    return null;
  }
  return (
    <div className={styles.wrapper} onClick={onClick}>
      {installing ? 'Installing...' : `Buttercup ${version} is available. Click here to install now.`}
    </div>
  );
};

UpdateNotice.propTypes = {
  available: PropTypes.bool,
  installing: PropTypes.bool,
  version: PropTypes.string,
  onClick: PropTypes.func
};

export default UpdateNotice;
