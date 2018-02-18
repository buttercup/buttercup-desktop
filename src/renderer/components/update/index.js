import React, { PureComponent } from 'react';
import { shell } from 'electron';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import ReactMarkdown from 'react-markdown';
import '../../styles/workspace.global.scss';
import icon from '../../styles/img/icons/256x256.png';

const MARKDOWN = `
This release marks a huge milestone for us! This is the first stable release of Buttercup Desktop since September 2015 that we started this project. Before v1.0.0, we released 57 alpha and beta versions of Buttercup Desktop, 30+ amazing developers contributed to this project and we had 200k downloads.

![Buttercup Desktop with icons](https://user-images.githubusercontent.com/3869469/35880367-6bd58770-0b86-11e8-879f-d1f9136274a9.png)

Thank you everyone 🎉

This version includes the following improvements and new features:

+ Entry Icons #16
+ Lock the currently active archive using \`Cmd+L\` on macOS or \`Ctrl+L\` on Windows and Linux. #470
+ **New language:** Ukrainian 🇺🇦 #491

[Full list of changes](https://github.com/buttercup/buttercup-desktop/compare/v0.26.0...v1.0.1)
`;

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

  img {
    width: 100%;
  }
`;

export default class Update extends PureComponent {
  handleLinkClick(e, href) {
    e.preventDefault();
    shell.openExternal(href);
  }
  render() {
    return (
      <Wrapper flexAuto>
        <Icon>
          <img src={icon} />
        </Icon>
        <Flex flexColumn>
          <Header>
            <h4>A new version Buttercup is available!</h4>
            <p>
              Buttercup 2.3.1 is now available. You have 1.2.5. Would you like
              to download it now?
            </p>
            <h5>Release Notes:</h5>
          </Header>
          <ReleaseNotes>
            <ReactMarkdown
              source={MARKDOWN}
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
            <Button>Skip This Version</Button>
            <Button primary>Install Update</Button>
          </Flex>
        </Flex>
      </Wrapper>
    );
  }
}
