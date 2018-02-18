import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import '../../styles/workspace.global.scss';
import icon from '../../styles/img/icons/256x256.png';

const Wrapper = styled(Flex)`
  background-color: #ececec;
  flex: 1;
  padding: var(--spacing-two);

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
`;

export default class Update extends PureComponent {
  render() {
    return (
      <Wrapper flexAuto>
        <Icon>
          <img src={icon} />
        </Icon>
        <Flex flexColumn>
          <div>
            <h4>A new version Buttercup is available!</h4>
            <p>
              Buttercup 2.3.1 is now available. You have 1.2.5. Would you like
              to download it now?
            </p>
            <h5>Release Notes:</h5>
          </div>
          <ReleaseNotes>Hello</ReleaseNotes>
          <Flex justify="space-between">
            <Button>Skip This Version</Button>
            <Button primary>Install Update</Button>
          </Flex>
        </Flex>
      </Wrapper>
    );
  }
}
