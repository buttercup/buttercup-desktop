import React, { Component } from 'react';
import { Button } from 'buttercup-ui';
import { isButtercupFile } from '../../system/utils';
import styles from '../../styles/file-manager';
import Manager from './manager';
import '../../styles/workspace.global.scss';

class FileManager extends Component {
  state = {
    selectedFile: null
  };

  handleSelectFile = file => {
    this.setState({
      selectedFile: isButtercupFile(file) ? file : null
    });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.managerWrapper}>
          <Manager onSelectFile={this.handleSelectFile}/>
        </div>
        <div className={styles.footer}>
          <div></div>
          <div>
            <Button >Nevermind</Button>{' '}
            <Button primary disabled={this.state.selectedFile === null}>Open in Buttercup</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FileManager;
