import React, { Component, PropTypes } from 'react';
import Intro from '../components/Intro';
import TreeView from '../containers/TreeView';

class Workspace extends Component {
  render() {
    const { ui } = this.props;
    return (
      <div>
        {ui.archiveOpen ? <TreeView/> : <Intro/>}
      </div>
    );
  }
}

Workspace.propTypes = {
  ui: PropTypes.object
};

export default Workspace;
