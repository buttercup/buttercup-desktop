import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { translate, Trans, Interpolate } from 'react-i18next';
import { Flex } from 'styled-flexbox';
import { isOSX } from '../../shared/utils/platform';
import logo from '../styles/img/solo-logo.svg';
import AddArchiveButton from '../containers/add-archive-button';

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

const NoArchiveSelectedView = ({ t }) => (
  <ColoredFlex align="center" justify="center" flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Trans i18nKey="welcome-back-title" parent="span">
          Welcome back to Buttercup.
        </Trans>
      </Title>
      <Caption>
        <Interpolate
          i18nKey="unlock-archive"
          os={`${isOSX() ? '⌘' : 'Ctrl'}+1`}
        >
          Unlock an archive to begin ({`${isOSX() ? '⌘' : 'Ctrl'}+1`}).
        </Interpolate>
      </Caption>
    </Figure>
  </ColoredFlex>
);

NoArchiveSelectedView.propTypes = {
  t: PropTypes.func
};

export const NoArchiveSelected = translate()(NoArchiveSelectedView);

const WelcomeScreenView = ({ t }) => (
  <ColoredFlex align="center" justify="center" flexColumn flexAuto>
    <Figure>
      <img src={logo} />
      <Title>
        <Trans i18nKey="welcome-title" parent="span">
          Welcome to Buttercup.
        </Trans>
      </Title>
      <Caption>
        <Trans i18nKey="welcome-caption" parent="span">
          You haven't added any archives yet. Why not add one?
        </Trans>
      </Caption>
    </Figure>
    <AddArchiveButton />
  </ColoredFlex>
);

WelcomeScreenView.propTypes = {
  t: PropTypes.func
};

export const WelcomeScreen = translate()(WelcomeScreenView);
