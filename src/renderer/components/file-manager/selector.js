import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'buttercup-ui';
import styles from '../../styles/file-manager';
import { isButtercupFile } from '../../system/utils';
import Manager from './manager';

class Selector extends Component {
  static propTypes = {
    fs: PropTypes.object
  };
  
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
          <Manager onSelectFile={this.handleSelectFile} fs={this.props.fs}/>
        </div>
        <div className={styles.footer}>
          <div></div>
          <div>
            <Link to="/"><Button>Nevermind</Button></Link>{' '}
            <Button primary disabled={this.state.selectedFile === null}>Open in Buttercup</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Selector;
