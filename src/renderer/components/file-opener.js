import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import FolderIcon from 'react-icons/lib/fa/folder-open-o';
import FileIcon from 'react-icons/lib/fa/file-text-o';
import CloudIcon from 'react-icons/lib/md/cloud-queue';
import { Button, ButtonRow } from 'buttercup-ui';
import { isOSX } from '../system/utils';
import pkg from '../../../package.json';
import logo from '../styles/img/logo.svg';
import styles from '../styles/file-opener';

class FileOpener extends Component {
  render() {
    return (
      <div className={cx(styles.container, isOSX() && styles.mac)}>
        <figure className={styles.logo}>
          <img src={logo} alt="Buttercup" width="130"/>
          <figcaption>v{pkg.version}</figcaption>
        </figure>
        <div>
          <ButtonRow>
            <Button onClick={this.props.onOpenClick} icon={<FolderIcon/>} primary>Open...</Button>{' '}
            <Button onClick={this.props.onNewClick} icon={<FileIcon/>}>New Local Archive...</Button>
            <Button onClick={this.props.onCloudClick} icon={<CloudIcon/>}>From Cloud</Button>
          </ButtonRow>
        </div>
      </div>
    );
  }
}

FileOpener.propTypes = {
  onOpenClick: PropTypes.func,
  onNewClick: PropTypes.func,
  onCloudClick: PropTypes.func
};

export default FileOpener;
