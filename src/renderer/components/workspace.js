import React, { PropTypes } from 'react';
import 'glamor/reset';
import Intro from '../components/intro';
import Archive from '../components/archive';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';

const Workspace = ({workspace, update, installUpdate}) => {
  return (
    <div>
      {(workspace.archive.path === null) ? <Intro/> : <Archive/>}
      <UpdateNotice {...update} onClick={() => installUpdate()}/>
    </div>
  );
};

Workspace.propTypes = {
  workspace: PropTypes.object,
  update: PropTypes.object,
  installUpdate: PropTypes.func
};

export default Workspace;
