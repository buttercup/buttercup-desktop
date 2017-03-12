import React, { Component } from 'react';
import styles from '../../styles/file-manager';
import Manager, { propTypes } from './manager';

class FileManager extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.managerWrapper}>
          <Manager {...this.props}/>
        </div>
        <div style={{ flex: '0 0 50px' }}>
          <button onClick={() => this.props.handleCreateNewDirectory()}>New Folder</button>
          <button>Open</button>
        </div>
      </div>
    );
  }
}

FileManager.propTypes = propTypes;

export default FileManager;
