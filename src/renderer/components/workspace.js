import React, { Component, PropTypes } from 'react';
import Intro from '../components/intro';
import Archive from '../components/archive';

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
