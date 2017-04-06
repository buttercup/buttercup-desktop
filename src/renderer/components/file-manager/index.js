import React, { Component } from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { Button } from 'buttercup-ui';
import styled from 'styled-components';
import '../../styles/workspace.global.scss';
import { emitActionToParentAndClose } from '../../system/utils';
import TypeSelector from './type-selector';
import Dropbox from './sources/dropbox';
import Webdav from './sources/webdav';

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  height: 100vh;
`;

const FlexGrow = styled.div`
  flex: 1;
  display: flex;
`;

const Footer = styled.div`
  flex: 0 0 50px;
  padding: 12px;
  background-color: #F5F7FA;
  display: flex;
  flex-direction: row;

  > div {
    flex: 0 0 50%;

    &:last-child {
      text-align: right;
    }
  }
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
        <Wrapper>
          <FlexGrow>
            <Route exact path="/" component={TypeSelector}/>
            <Route path="/dropbox" render={() => <Dropbox onSelect={this.handleSelectFile}/>}/>
            <Route path="/webdav" render={() => <Webdav onSelect={this.handleSelectFile}/>}/>
          </FlexGrow>
          <Footer>
            <div></div>
            <div>
              <Link to="/"><Button>Nevermind</Button></Link>{' '}
              <Button
                primary
                disabled={this.state.selectedConfig === null}
                onClick={this.handleOpenClick}
                >Open in Buttercup</Button>
            </div>
          </Footer>
        </Wrapper>
      </Router>
    );
  }
}
