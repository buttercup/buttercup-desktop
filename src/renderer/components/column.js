import PropTypes from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import { Flex, Box } from 'styled-flexbox';

const Wrapper = styled(Flex)`
  width: 100%;
`;

const Content = styled(Box)``;

const Bar = styled.section`
  border: 0 solid rgba(255, 255, 255, 0.05);
  flex: 0;
  padding: var(--spacing-half) var(--spacing-one);

  &.light {
    border-color: var(--black-5);
  }
`;

const Header = styled(Bar)`
  border-bottom-width: 1px;
`;

const Footer = styled(Bar)`
  border-top-width: 1px;
`;

const Column = ({
  children,
  footer = null,
  header = null,
  className = null,
  contentClassName = null,
  light = false,
  ...rest
}) => (
  <Wrapper flexColumn className={className} {...rest}>
    {header && <Header>{header}</Header>}
    <Scrollbars style={{ display: 'flex' }}>
      <Content flexAuto className={contentClassName}>
        {children}
      </Content>
    </Scrollbars>
    {footer && <Footer className={light && 'light'}>{footer}</Footer>}
  </Wrapper>
);

Column.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  light: PropTypes.bool
};

export default Column;
