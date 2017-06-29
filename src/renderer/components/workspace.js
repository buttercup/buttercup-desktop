import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';

const Scene = styled.div`
  flex: 1;
  overflow: hidden;
  max-width: 100%;
`;

const Primary = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(var(--sidebar-width));
`;

const Workspace = ({ currentArchive, update, installUpdate, setColumnSize, columnSizes }) => {
  return (
    <Scene>
      <Sidebar>Hello</Sidebar>
      <Primary>
        <Archive
          columnSizes={columnSizes}
          onColumnSizeChange={setColumnSize}
          />
      </Primary>
      <UpdateNotice {...update} onClick={() => installUpdate()} />
    </Scene>
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
