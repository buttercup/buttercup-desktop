import React, { Component } from 'react';
import Manager from './manager';
// import styles from '../../styles/file-manager';

class FileManager extends Component {
  render() {
    return (
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{flex: 1}}>
          <Manager {...this.props}/>
        </div>
        <div style={{flex: '0 0 50px'}}>
          <button>New Folder</button>
          <button>Open</button>
        </div>
      </div>
    );
  }
}

export default FileManager;
