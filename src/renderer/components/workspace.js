import React, { Component, PropTypes } from 'react';
import Intro from '../components/Intro';
import Archive from '../components/Archive';

class Workspace extends Component {
  render() {
    const { ui } = this.props;
    return (
      <div>
        {ui.archiveOpen ?
          <Archive/> : <Intro/>
        }
      </div>
    );
  }
}

Workspace.propTypes = {
  ui: PropTypes.object
};

export default Workspace;
