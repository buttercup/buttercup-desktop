import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';

const Caption = styled.figcaption`
  color: var(--gray-dark);
  font-weight: 300;
`;

const EmptyView = ({ caption, imageSrc, className }) => {
  return (
    <Flex align="center" justify="center" flexAuto className={className}>
      <figure>
        {imageSrc && <img src={imageSrc} />}
        <Caption>{caption}</Caption>
      </figure>
    </Flex>
  );
};

EmptyView.propTypes = {
  caption: PropTypes.string,
  className: PropTypes.string,
  imageSrc: PropTypes.string
};

export default EmptyView;
