import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const UpdateNotice = ({
  available,
  version,
  installing,
  onClick,
  className
}) => {
  if (!available) {
    return null;
  }
  return (
    <div className={className} onClick={onClick}>
      {installing
        ? 'Installing...'
        : `Buttercup ${version} is available. Click here to install now.`}
    </div>
  );
};

UpdateNotice.propTypes = {
  available: PropTypes.bool,
  installing: PropTypes.bool,
  version: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default styled(UpdateNotice)`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  background-color: var(--brand-primary);
  color: #fff;
  padding: var(--spacing-half);
  font-weight: 300;
  font-size: 0.7em;
  border-radius: 3px;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--brand-primary-darker);
  }
`;
