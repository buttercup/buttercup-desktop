import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { isOSX } from '../../shared/utils/platform';
import logo from '../styles/img/solo-logo.svg';

const Caption = styled.figcaption`
  color: var(--gray-dark);
  font-weight: 300;
`;

const Figure = styled.figure`
  text-align: center;
`;

const EmptyView = ({ caption, imageSrc, className }) => {
  return (
    <Flex align="center" justify="center" flexAuto className={className}>
      <Figure>
        {imageSrc && <img src={imageSrc} />}
        <Caption>{caption}</Caption>
      </Figure>
    </Flex>
  );
};

EmptyView.propTypes = {
  caption: PropTypes.string,
  className: PropTypes.string,
  imageSrc: PropTypes.string
};

export default EmptyView;

const WhiteFlex = styled(Flex)`
  background-color: RGBA(20, 20, 20, .8);
  color: #fff;
`;

const Title = styled.h3`
  margin-bottom: var(--spacing-half);
`;

export const NoArchiveSelected = () => (
  <WhiteFlex align="center" justify="center" flexAuto>
    <Figure>
      <img src={logo} />
      <Title>Welcome back to Buttercup.</Title>
      <Caption>Unlock an archive to begin ({isOSX() ? '⌘' : 'Ctrl'}+1).</Caption>
    </Figure>
  </WhiteFlex>
);
