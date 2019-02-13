import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import extractDomain from 'extract-domain';
import { getIconFilename } from '@buttercup/iconographer';
import defaultIcon from '../../styles/img/no-icon.svg';
import { getEntryURL } from '../../../shared/buttercup/entries';
import { useSafeState } from '../../../shared/hooks';

const IconWrapper = styled.div`
  height: ${props => (props.big ? '45px' : '32px')};
  width: ${props => (props.big ? '45px' : '32px')};
  flex: 0 0 ${props => (props.big ? '45px' : '32px')};

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

const EntryIcon = ({ entry, big }) => {
  const [icon, setIcon] = useSafeState(defaultIcon);

  useEffect(() => {
    if (!entry) {
      return;
    }
    const url = getEntryURL(entry);
    const domain = url ? extractDomain(url) : null;
    setIcon(getIconFilename(domain));
  });

  return (
    <IconWrapper big={big}>
      <img src={icon} />
    </IconWrapper>
  );
};

EntryIcon.propTypes = {
  big: PropTypes.bool,
  entry: PropTypes.object
};

export default EntryIcon;
