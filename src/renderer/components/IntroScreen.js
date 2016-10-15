import React from 'react';
import RecentFiles from '../containers/RecentFiles';
import FileOpener from '../containers/FileOpener';
import TreeView from '../containers/TreeView';

const IntroScreen = () => {
  return (
    <div>
      <FileOpener/>
      <RecentFiles/>
      <br/>
      <br/>
      <TreeView/>
    </div>
  );
};

export default IntroScreen;
