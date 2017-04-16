import React from 'react';
import { Flex } from 'styled-flexbox';
import RecentFiles from '../containers/recent-files';
import FileOpener from '../containers/file-opener';

const Intro = () => (
  <Flex flexAuto>
    <FileOpener />
    <RecentFiles />
  </Flex>
);

export default Intro;
