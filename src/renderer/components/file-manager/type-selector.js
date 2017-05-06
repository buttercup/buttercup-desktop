import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { brands } from '../../../shared/buttercup/brands';

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
    {
      Object.keys(brands).map(brand => (
        <LogoLink key={brand} to={`/${brand}`}>
          <img src={brands[brand].logo} />
          <span>{brands[brand].name}</span>
        </LogoLink>
      ))
    }
  </Flex>
);

export default TypeSelector;
