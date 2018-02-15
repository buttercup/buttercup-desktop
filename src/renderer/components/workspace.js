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
import spinner from '../styles/img/spinner.svg';

const Primary = styled(Flex)`
  position: relative;
`;

const LoadingWrapper = styled(Flex)``;

const Workspace = ({
  currentArchive,
  archivesCount,
  update,
  installUpdate,
  setColumnSize,
  columnSizes,
  condencedSidebar,
  archivesLoading
}) => {
  return (
    <Flex flexAuto>
      <If condition={archivesCount > 0}>
        <Sidebar condenced={condencedSidebar} />
      </If>
      <Primary flexAuto>
        <Choose>
          <When condition={archivesLoading}>
            <LoadingWrapper align="center" justify="center" flexColumn flexAuto>
              <img width="64" src={spinner} alt="Loading" />
            </LoadingWrapper>
          </When>
          <Otherwise>
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
  archivesLoading: PropTypes.bool,
  installUpdate: PropTypes.func,
  setColumnSize: PropTypes.func
};

export default Workspace;
