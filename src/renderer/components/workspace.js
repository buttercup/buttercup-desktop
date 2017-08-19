import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';
import EmptyView, { NoArchiveSelected } from './empty-view';

const Primary = styled(Flex)`
  position: relative;
`;

const Workspace = ({ currentArchive, update, installUpdate, setColumnSize, columnSizes, condencedSidebar }) => {
  return (
    <Flex flexAuto>
      <Sidebar condenced={condencedSidebar} />
      <Primary flexAuto>
        <Choose>
          <When condition={currentArchive === null}>
            <NoArchiveSelected />
          </When>
          <Otherwise>
            <Archive columnSizes={columnSizes} onColumnSizeChange={setColumnSize} />
          </Otherwise>
        </Choose>
      </Primary>
      <UpdateNotice {...update} onClick={() => installUpdate()} />
    </Flex>
  );
};

Workspace.propTypes = {
  currentArchive: PropTypes.object,
  update: PropTypes.object,
  columnSizes: PropTypes.object,
  condencedSidebar: PropTypes.bool,
  installUpdate: PropTypes.func,
  setColumnSize: PropTypes.func,
};

export default Workspace;
