import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';

const UpdateNotice = ({
  available,
  version,
  installing,
  onClick,
  className,
  t
}) => {
  if (!available) {
    return null;
  }
  return (
    <div className={className} onClick={onClick}>
      {installing
        ? t('installing') + '...'
        : t('update-available-message', {
            version
          })}
    </div>
  );
};

UpdateNotice.propTypes = {
  available: PropTypes.bool,
  installing: PropTypes.bool,
  version: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  t: PropTypes.func
};

export default styled(translate()(UpdateNotice))`
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
