import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { brands } from '../../../shared/buttercup/brands';

const Wrapper = styled(Flex)`
  padding: var(--spacing-two) var(--spacing-one) 0;
`;

const LogoLink = styled(Link)`
  display: flex;
  flex: 0 1 calc((100% / 2) - 20px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: var(--spacing-two);
  border: 1px solid var(--gray);
  border-radius: 5px;
  color: var(--gray-dark);
  text-decoration: none;

  img {
    max-height: 60px;
  }

  span {
    margin-top: var(--spacing-one);
    color: var(--gray-dark);
    font-size: 0.85rem;
  }

  &:hover {
    background-color: var(--gray-light);
  }
`;

const TypeSelector = () => (
  <Wrapper wrap flexAuto alignContent="stretch" justify="space-around">
    {Object.keys(brands)
      .filter(brand => brands[brand].remote)
      .map(brand => (
        <LogoLink key={brand} to={`/${brand}`}>
          <img src={brands[brand].logo} />
          <span>{brands[brand].name}</span>
        </LogoLink>
      ))}
  </Wrapper>
);

export default TypeSelector;
