import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dropboxLogo from '../../styles/img/logos/dropbox.svg';
import ownCloud from '../../styles/img/logos/owncloud.svg';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const LogoLink = styled(Link)`
  display: flex;
  width: 200px;
  height: 130px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid #ededed;
  margin: 5px;
  border-radius: 5px;
  color: #777;
  text-decoration: none;

  img {
    max-width: 70%;
  }
`;

const TypeSelector = () => (
  <Wrapper>
    <LogoLink to="/dropbox">
      <img src={dropboxLogo}/>
    </LogoLink>
    <LogoLink to="/owncloud">
      <img src={ownCloud}/>
    </LogoLink>
    <LogoLink to="/webdav">Generic WebDAV</LogoLink>
  </Wrapper>
);

export default TypeSelector;
