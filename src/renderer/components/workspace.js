import React, { PropTypes } from 'react';
import 'glamor/reset';
import Intro from '../components/intro';
import Archive from '../components/archive';
import '../styles/workspace.global.scss';

const Workspace = ({workspace}) => {
  if (workspace.archive.path === null) {
    return <Intro/>;
  }
  return <Archive/>;
};

Workspace.propTypes = {
  workspace: PropTypes.object
};

export default Workspace;
