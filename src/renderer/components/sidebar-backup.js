import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@buttercup/ui';
import ArchiveList from '../containers/archive-list';
import Column from './column';

const Wrapper = styled.div`
  width: var(--sidebar-width);
  height: 100%;
  background-color: var(--sidebar-bg);
  display: flex;
`;

export default class Sidebar extends Component {
  render() {
    return (
      <Wrapper>
        <Column
          header={<div>moi</div>}
          footer={<Button full>moi</Button>}
          >
          <ArchiveList />
        </Column>
      </Wrapper>
    );
  }
}
