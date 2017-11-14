import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { injectIntl, intlShape } from 'react-intl';

const UpdateNotice = ({
  available,
  version,
  installing,
  onClick,
  className,
  intl
}) => {
  if (!available) {
    return null;
  }
  return (
    <div className={className} onClick={onClick}>
      {installing
        ? intl.formatMessage({
            id: 'installing',
            defaultMessage: 'Installing'
          }) + '...'
        : intl.formatMessage(
            {
              id: 'update-available-message',
              defaultMessage:
                'Buttercup {version} is available. Click here to install now.'
            },
            {
              version
            }
          )}
    </div>
  );
};

UpdateNotice.propTypes = {
  available: PropTypes.bool,
  installing: PropTypes.bool,
  version: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  intl: intlShape.isRequired
};

export default styled(injectIntl(UpdateNotice))`
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
