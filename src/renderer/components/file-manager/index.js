import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { Button, ButtonRow } from 'buttercup-ui';
import styled from 'styled-components';
import '../../styles/workspace.global.scss';
import { emitActionToParentAndClose } from '../../system/utils';
import { Flex, Box } from './tools';
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

  render() {
    return (
      <Router>
        <Wrapper flexAuto flexColumn>
          <Flex flexAuto>
            <Route exact path="/" component={TypeSelector}/>
            <Route path="/dropbox" render={() => <Dropbox onSelect={this.handleSelectFile}/>}/>
            <Route path="/webdav" render={() => <Webdav onSelect={this.handleSelectFile}/>}/>
          </Flex>
          <Footer>
            <Box width="50%"/>
            <Flex justify="flex-end" align="center" width="50%">
              <ButtonRow>
                <Link to="/"><Button>Nevermind</Button></Link>
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
