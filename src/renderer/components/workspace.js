import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';
import SavingModal from './saving-modal';
import { NoArchiveSelected, WelcomeScreen } from './empty-view';

const Primary = styled(Flex)`
  position: relative;
`;

const Workspace = ({
  currentArchive,
  archivesCount,
  update,
  installUpdate,
  setColumnSize,
  columnSizes,
  condencedSidebar
}) => {
  return (
    <Flex flexAuto>
      {archivesCount > 0 && <Sidebar condenced={condencedSidebar} />}
      <Primary flexAuto>
        <Choose>
          <When condition={archivesCount === 0}>
            <WelcomeScreen />
          </When>
          <When condition={archivesCount > 0 && currentArchive === null}>
            <NoArchiveSelected />
          </When>
          <Otherwise>
            <Archive
              columnSizes={columnSizes}
              onColumnSizeChange={setColumnSize}
            />
          </Otherwise>
        </Choose>
      </Primary>
      <UpdateNotice {...update} onClick={() => installUpdate()} />
      <SavingModal />
    </Flex>
  );
};

Workspace.propTypes = {
  currentArchive: PropTypes.object,
  archivesCount: PropTypes.number,
  update: PropTypes.object,
  columnSizes: PropTypes.object,
  condencedSidebar: PropTypes.bool,
  installUpdate: PropTypes.func,
  setColumnSize: PropTypes.func
};

export default Workspace;
