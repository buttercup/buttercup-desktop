import React from 'react';
import RecentFiles from '../containers/recent-files';
import FileOpener from '../containers/file-opener';

const Intro = () => (
  <div>
    <FileOpener/>
    <RecentFiles/>
  </div>
);

export default Intro;
