import React, { PureComponent } from 'react';
import { shell, ipcRenderer } from 'electron';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import sanitizeHtml from 'sanitize-html';
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

  p {
    margin: 0 0 1rem;
  }
`;

export default class Update extends PureComponent {
  state = {
    version: null,
    currentVersion: null,
    releaseNotes: null,
    percent: 0
  };

  componentDidMount() {
    ipcRenderer.on(
      'update-available',
      (event, { version, currentVersion, releaseNotes }) => {
        this.setState({
          version,
          currentVersion,
          releaseNotes: sanitizeHtml(releaseNotes)
        });
      }
    );
    ipcRenderer.on('download-progress', (event, { percent }) => {
      this.setState({ percent });
    });
    ipcRenderer.on('update-error', () => {
      this.setState({ percent: 0 });
    });
    ipcRenderer.send('init');
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('update-avialable');
    ipcRenderer.removeListener('update-error');
    ipcRenderer.removeListener('download-progress');
  }

  handleLinkClick(e, href) {
    e.preventDefault();
    shell.openExternal(href);
  }

  handleDownload = () => {
    ipcRenderer.send('download-update');
  };

  handleSkip = () => {
    window.close();
  };

  render() {
    if (!this.state.version) {
      return null;
    }
    return (
      <Wrapper flexAuto>
        <Icon>
          <img src={icon} />
        </Icon>
        <Flex flexColumn flexAuto>
          <Header>
            <h4>A new version of Buttercup is available!</h4>
            <p>
              Buttercup {this.state.version} is now available. You have{' '}
              {this.state.currentVersion}. Would you like to download it now?
            </p>
            <h5>Release Notes:</h5>
          </Header>
          <ReleaseNotes
            dangerouslySetInnerHTML={{ __html: this.state.releaseNotes }}
          />
          <Flex justify="space-between">
            <Button onClick={this.handleSkip} dark>
              Not Now
            </Button>
            <Button
              primary
              onClick={this.handleDownload}
              loading={this.state.percent > 0}
              disabled={this.state.percent > 0}
            >
              Download and Install
            </Button>
          </Flex>
        </Flex>
      </Wrapper>
    );
  }
}
