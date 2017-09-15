import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';
import { NoArchiveSelected, WelcomeScreen } from './empty-view';
import spinner from '../styles/img/spinner.svg';

const Primary = styled(Flex)`
  position: relative;
`;

const SavingDialog = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .4);
`;

const SavingDialogText = styled.div`
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, .9);
  border-radius: 10px;
  padding: var(--spacing-half) var(--spacing-one);

  p {
    margin: 0;
  }
`;

const Workspace = ({
  currentArchive,
  archivesCount,
  update,
  installUpdate,
  setColumnSize,
  columnSizes,
  condencedSidebar,
  savingArchive,
  isExiting
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
            <Archive columnSizes={columnSizes} onColumnSizeChange={setColumnSize} />
          </Otherwise>
        </Choose>
      </Primary>
      <UpdateNotice {...update} onClick={() => installUpdate()} />
      <If condition={savingArchive && isExiting}>
        <SavingDialog align="center" justify="center">
          <SavingDialogText>
            <img width="64" src={spinner} alt="Loading" />
            <p>Your archive is being saved.<br />Exiting automatically...</p>
          </SavingDialogText>
        </SavingDialog>
      </If>
    </Flex>
  );
};

Workspace.propTypes = {
  currentArchive: PropTypes.object,
  archivesCount: PropTypes.number,
  update: PropTypes.object,
  columnSizes: PropTypes.object,
  condencedSidebar: PropTypes.bool,
  savingArchive: PropTypes.bool,
  isExiting: PropTypes.bool,
  installUpdate: PropTypes.func,
  setColumnSize: PropTypes.func,
};

export default Workspace;
