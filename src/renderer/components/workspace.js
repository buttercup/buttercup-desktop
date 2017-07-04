import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import '../styles/workspace.global.scss';
import UpdateNotice from './update-notice';

const Primary = styled(Box)`
  position: relative;
`;

const Workspace = ({ currentArchive, update, installUpdate, setColumnSize, columnSizes }) => {
  return (
    <Flex flexAuto>
      <Sidebar condenced={false} />
      <Primary flexAuto>
        <Archive
          columnSizes={columnSizes}
          onColumnSizeChange={setColumnSize}
          />
      </Primary>
      <UpdateNotice {...update} onClick={() => installUpdate()} />
    </Flex>
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
