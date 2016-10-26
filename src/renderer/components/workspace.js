import React, { Component, PropTypes } from 'react';
import Intro from '../components/intro';
import Archive from '../components/archive';
import './styles/workspace.global.scss';
import styles from './styles/commons.scss';

class Workspace extends Component {
  render() {
    const { workspace } = this.props;
    return (
      <div className={styles.flexContainer}>
        {workspace.archive.path === null ?
          <Intro/> : <Archive/>
        }
      </div>
    );
  }
}

Workspace.propTypes = {
  workspace: PropTypes.object
};

export default Workspace;
