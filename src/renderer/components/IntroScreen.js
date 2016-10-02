import React from 'react';
import RecentFiles from '../containers/RecentFiles';
import FileOpener from '../containers/FileOpener';
import Groups from '../containers/Groups';

const IntroScreen = () => {
  return (
    <div>
      <FileOpener/>
      <RecentFiles/>
      <br/>
      <br/>
      <Groups/>
    </div>
  );
};

export default IntroScreen;
