import React from 'react';
import RecentFiles from '../containers/recent-files';
import FileOpener from '../containers/file-opener';
import { wrapper } from '../styles/intro';

const Intro = () => (
  <div className={wrapper}>
    <FileOpener/>
    <RecentFiles/>
  </div>
);

export default Intro;
