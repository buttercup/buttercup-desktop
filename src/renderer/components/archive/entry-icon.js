import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultIcon from '../../styles/img/no-icon.svg';

const IconWrapper = styled.div`
  height: ${props => (props.big ? '45px' : '32px')};
  width: ${props => (props.big ? '45px' : '32px')};

  border-radius: 3px;
  background-color: #fff;
  padding: 2px;

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 2px;
  }
`;

const EntryIcon = ({ icon, big }) => (
  <IconWrapper big={big}>
    <img src={icon || defaultIcon} />
  </IconWrapper>
);

EntryIcon.propTypes = {
  big: PropTypes.bool,
  icon: PropTypes.string
};

export default EntryIcon;
