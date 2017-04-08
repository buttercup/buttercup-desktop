import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dropboxLogo from '../../styles/img/logos/dropbox.svg';
import ownCloud from '../../styles/img/logos/owncloud.svg';
import { Flex } from './tools';

const LogoLink = styled(Link)`
  display: flex;
  width: 200px;
  height: 130px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid var(--gray);
  margin: 5px;
  border-radius: 5px;
  color: var(--gray-dark);
  text-decoration: none;

  img {
    max-width: 70%;
  }
`;

const TypeSelector = () => (
  <Flex wrap flexAuto align="center" justify="center">
    <LogoLink to="/dropbox">
      <img src={dropboxLogo}/>
    </LogoLink>
    <LogoLink to="/owncloud">
      <img src={ownCloud}/>
    </LogoLink>
    <LogoLink to="/webdav">Generic WebDAV</LogoLink>
  </Flex>
);

export default TypeSelector;
