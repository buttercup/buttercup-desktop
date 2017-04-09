import React, { Component } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Button, ButtonRow } from 'buttercup-ui';
import { Flex } from 'styled-flexbox';
import styled from 'styled-components';
import '../../styles/workspace.global.scss';
import { emitActionToParentAndClose, closeCurrentWindow } from '../../system/utils';
import TypeSelector from './type-selector';
import Dropbox from './sources/dropbox';
import Webdav from './sources/webdav';

const Wrapper = styled(Flex)`
  background-color: #fff;
`;

const Footer = styled(Flex)`
  flex: 0 0 50px;
  padding: var(--spacing-one);
  background-color: var(--gray-light);
`;

export default class FileManager extends Component {
  state = {
    selectedConfig: null
  };

  handleSelectFile = config => {
    this.setState({
      selectedConfig: config
    });
  }

  handleOpenClick = () => {
    emitActionToParentAndClose('load-archive', this.state.selectedConfig);
  }

  handleClose() {
    closeCurrentWindow();
  }

  render() {
    return (
      <Router>
        <Wrapper flexAuto flexColumn>
          <Flex flexAuto>
            <Route exact path="/" component={TypeSelector}/>
            <Route path="/dropbox" render={() => <Dropbox onSelect={this.handleSelectFile}/>}/>
            <Route path="/owncloud" render={() => <Webdav owncloud onSelect={this.handleSelectFile}/>}/>
            <Route path="/webdav" render={() => <Webdav onSelect={this.handleSelectFile}/>}/>
          </Flex>
          <Footer>
            <Flex align="center" width="50%">
              <Button onClick={this.handleClose}>Cancel</Button>
            </Flex>
            <Flex justify="flex-end" align="center" width="50%">
              <ButtonRow>
                <NavLink
                  exact
                  to="/"
                  activeStyle={{display: 'none'}}
                  ><Button transparent>Go Back</Button></NavLink>
                <Button
                  primary
                  disabled={this.state.selectedConfig === null}
                  onClick={this.handleOpenClick}
                  >Open in Buttercup</Button>
              </ButtonRow>
            </Flex>
          </Footer>
        </Wrapper>
      </Router>
    );
  }
}
