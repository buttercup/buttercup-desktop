import React, { PropTypes } from 'react';
import 'glamor/reset';
// import Intro from '../components/intro';
import FileManager from '../containers/file-manager';
import Archive from '../components/archive';
import '../styles/workspace.global.scss';

const Workspace = ({workspace}) => {
  if (workspace.archive.path === null) {
    // return <Intro/>;
    return (
      <div style={{height: '100vh', width: '100vw'}}>
        <FileManager/>
      </div>
    );
  }
  return <Archive/>;
};

Workspace.propTypes = {
  workspace: PropTypes.object
};

export default Workspace;
