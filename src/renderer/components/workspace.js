import React, { PropTypes } from 'react';
import Intro from '../components/intro';
import Archive from '../components/archive';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';

const Workspace = ({ currentArchive, update, installUpdate, setColumnSize, columnSizes }) => {
  return (
    <div>
      {
        (currentArchive === null)
          ? <Intro />
          : <Archive
            columnSizes={columnSizes}
            onColumnSizeChange={setColumnSize}
            />
      }
      <UpdateNotice {...update} onClick={() => installUpdate()} />
    </div>
  );
};

Workspace.propTypes = {
  currentArchive: PropTypes.object,
  update: PropTypes.object,
  columnSizes: PropTypes.object,
  installUpdate: PropTypes.func,
  setColumnSize: PropTypes.func,
};

export default Workspace;
