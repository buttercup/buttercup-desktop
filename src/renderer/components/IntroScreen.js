import React from 'react';
import RecentFiles from '../containers/RecentFiles';
import FileOpener from '../containers/FileOpener';

const IntroScreen = () => {
  return (
    <div>
      <FileOpener/>
      <RecentFiles/>
    </div>
  );
};

export default IntroScreen;
