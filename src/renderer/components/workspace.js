import React, { Component, PropTypes } from 'react';
import Intro from '../components/intro';
import Archive from '../components/archive';

class Workspace extends Component {
  render() {
    const { workspace } = this.props;
    return (
      <div>
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
