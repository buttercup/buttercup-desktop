import React from 'react';
import RecentFiles from '../containers/RecentFiles';
import FileOpener from '../containers/FileOpener';

const Intro = () => (
  <div>
    <FileOpener/>
    <RecentFiles/>
  </div>
);

export default Intro;
