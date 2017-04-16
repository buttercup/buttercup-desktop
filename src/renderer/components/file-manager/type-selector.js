import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import dropboxLogo from '../../styles/img/logos/dropbox.svg';
import ownCloud from '../../styles/img/logos/owncloud.png';
import webDAV from '../../styles/img/logos/webdav.png';

const LogoLink = styled(Link)`
  display: flex;
  width: 180px;
  height: 140px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid var(--gray);
  margin: 5px;
  border-radius: 5px;
  color: var(--gray-dark);
  text-decoration: none;

  img {
    max-height: 60px;
  }

  span {
    margin-top: var(--spacing-one);
    color: var(--gray-dark);
    font-size: .85rem;
  }

  &:hover {
    background-color: var(--gray-light);
  }
`;

const TypeSelector = () => (
  <Flex wrap flexAuto align="center" justify="center">
    <LogoLink to="/dropbox">
      <img src={dropboxLogo} />
      <span>Dropbox</span>
    </LogoLink>
    <LogoLink to="/owncloud">
      <img src={ownCloud} />
      <span>OwnCloud</span>
    </LogoLink>
    <LogoLink to="/webdav">
      <img src={webDAV} />
      <span>WebDAV</span>
    </LogoLink>
  </Flex>
);

export default TypeSelector;
