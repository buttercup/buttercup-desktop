import React, { PureComponent } from 'react';
import { shell, ipcRenderer } from 'electron';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import ReactMarkdown from 'react-markdown';
import '../../styles/workspace.global.scss';
import icon from '../../styles/img/icons/256x256.png';

const Wrapper = styled(Flex)`
  background-color: #ececec;
  flex: 1;
  padding: var(--spacing-two);
`;

const Header = styled.div`
  cursor: default;

  h4,
  h5 {
    margin: 0;
  }

  h4 {
    font-size: 15px;
  }

  p {
    margin: 0.5rem 0 1rem;
    font-size: 0.8rem;
  }
`;

const Icon = styled(Box)`
  padding: var(--spacing-one);
  margin-right: var(--spacing-two);

  img {
    width: 64px;
    height: 64px;
    display: block;
  }
`;

const ReleaseNotes = styled.div`
  background-color: #fff;
  border: 1px solid #888888;
  flex: 1;
  padding: 1rem;
  margin-bottom: var(--spacing-one);
  overflow: auto;
  font-size: 15px;

  img {
    width: 100%;
  }
`;

export default class Update extends PureComponent {
  state = {
    version: null,
    currentVersion: null,
    releaseNotes: null
  };

  componentDidMount() {
    ipcRenderer.on('update-available', (event, updateInfo) => {
      this.setState(updateInfo);
    });
    ipcRenderer.send('init');
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('update-avialable');
  }

  handleLinkClick(e, href) {
    e.preventDefault();
    shell.openExternal(href);
  }
  render() {
    if (!this.state.version) {
      return null;
    }
    return (
      <Wrapper flexAuto>
        <Icon>
          <img src={icon} />
        </Icon>
        <Flex flexColumn>
          <Header>
            <h4>A new version of Buttercup is available!</h4>
            <p>
              Buttercup {this.state.version} is now available. You have{' '}
              {this.state.currentVersion}. Would you like to download it now?
            </p>
            <h5>Release Notes:</h5>
          </Header>
          <ReleaseNotes>
            <ReactMarkdown
              source={this.state.releaseNotes}
              renderers={{
                link: ({ href, children }) => (
                  <a href="#" onClick={e => this.handleLinkClick(e, href)}>
                    {children}
                  </a>
                )
              }}
            />
          </ReleaseNotes>
          <Flex justify="space-between">
            <Button>Remind me Later</Button>
            <Button primary>Download and Install</Button>
          </Flex>
        </Flex>
      </Wrapper>
    );
  }
}
