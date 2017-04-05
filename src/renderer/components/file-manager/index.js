import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import '../../styles/workspace.global.scss';
import Manager from './manager';
import TypeSelector from './type-selector';
import Dropbox from './sources/dropbox';
import Webdav from './sources/webdav';

export default () => (
  <Router>
    <div>
      <Route exact path="/" component={TypeSelector}/>
      <Route path="/manager" component={Manager}/>
      <Route path="/dropbox" component={Dropbox}/>
      <Route path="/webdav" component={Webdav}/>
    </div>
  </Router>
);
