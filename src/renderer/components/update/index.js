import React, { PureComponent } from 'react';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import sanitizeHtml from 'sanitize-html';
import { translate } from 'react-i18next';
import { Translate } from '../../../shared/i18n';
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

class Update extends PureComponent {
  state = {
    version: null,
    currentVersion: null,
    releaseNotes: null,
    percent: 0,
    installing: false
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

  handleDownload = () => {
    this.setState({ installing: true });
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
            <Translate i18nKey="update.new-version-available" parent="h4" />
            <Translate
              i18nKey="update.update-available-message"
              parent="p"
              values={{
                version: this.state.version,
                currentVersion: this.state.currentVersion
              }}
            />
            <Translate i18nKey="update.release-notes" parent="h5" />
          </Header>
          <ReleaseNotes
            dangerouslySetInnerHTML={{ __html: this.state.releaseNotes }}
          />
          <Flex justify="space-between">
            <Button
              onClick={this.handleSkip}
              dark
              disabled={this.state.installing}
            >
              <Translate i18nKey="update.not-now" />
            </Button>
            <Button
              primary
              onClick={this.handleDownload}
              loading={this.state.installing}
              disabled={this.state.installing}
            >
              <Translate i18nKey="update.download" />
            </Button>
          </Flex>
        </Flex>
      </Wrapper>
    );
  }
}

export default translate()(Update);
