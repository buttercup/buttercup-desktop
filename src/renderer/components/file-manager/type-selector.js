import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { brands } from '../../../shared/buttercup/brands';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: var(--spacing-one);
`;

const LogoLink = styled(Link)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: var(--spacing-one);
  padding: var(--spacing-two);
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
  <Wrapper>
    {Object.keys(brands)
      .filter(
        brand => brands[brand].remote && brands[brand].deprecated !== true
      )
      .map(brand => (
        <LogoLink key={brand} to={`/${brand}`}>
          <img src={brands[brand].logo} />
          <span>{brands[brand].name}</span>
        </LogoLink>
      ))}
  </Wrapper>
);

export default TypeSelector;
