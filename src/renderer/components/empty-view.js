import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Translate } from '../../shared/i18n';
import { Flex } from 'styled-flexbox';
import { isOSX } from '../../shared/utils/platform';
import logo from '../styles/img/solo-logo.svg';
import AddArchiveButton from '../containers/add-archive-button';

// Load illustrations
const requireTest = require.context(
  '../styles/img/illustrations',
  true,
  /\/\d+\.svg$/
);
const illustrations = requireTest.keys().map(requireTest);

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

const ColoredFlex = styled(Flex)`
  background-color: RGBA(20, 20, 20, 0.8);
  color: #fff;
`;

const Title = styled.h3`
  margin-bottom: var(--spacing-half);
`;

export const NoArchiveSelected = () => (
  <ColoredFlex align="center" justify="center" flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Translate i18nKey="intro.welcome-back-title" />
      </Title>
      <Caption>
        <Translate
          i18nKey="intro.unlock-archive"
          values={{
            os: `${isOSX() ? '⌘' : 'Ctrl'}+1`
          }}
        />
      </Caption>
    </Figure>
  </ColoredFlex>
);

export const WelcomeScreen = () => (
  <ColoredFlex align="center" justify="center" flexColumn flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Translate i18nKey="intro.welcome-title" />
      </Title>
      <Caption>
        <Translate i18nKey="intro.welcome-caption" />
      </Caption>
    </Figure>
    <AddArchiveButton />
  </ColoredFlex>
);

export function getRandomIllustration() {
  return illustrations[Math.floor(Math.random() * illustrations.length)];
}
