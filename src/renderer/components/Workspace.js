import React, { Component, PropTypes } from 'react';
import RecentFiles from '../containers/RecentFiles';
import FileOpener from '../containers/FileOpener';
import TreeView from '../containers/TreeView';

class IntroScreen extends Component {
  render() {
    const { ui } = this.props;
    return (
      <div>
        {!ui.archiveOpen && <FileOpener/>}
        {!ui.archiveOpen && <RecentFiles/>}
        {ui.archiveOpen && <TreeView/>}
      </div>
    );
  }
}

IntroScreen.propTypes = {
  ui: PropTypes.object
};

export default IntroScreen;
