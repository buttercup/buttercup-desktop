import React from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { Translate } from '../../shared/i18n';
import spinner from '../styles/img/spinner.svg';

const SavingDialog = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const SavingDialogText = styled.div`
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  padding: var(--spacing-half) var(--spacing-one);

  p {
    margin: 0;
  }
`;

export default () => (
  <SavingDialog align="center" justify="center">
    <SavingDialogText>
      <img width="64" src={spinner} alt="Loading" />
      <br />
      <Translate html i18nKey="archive.archive-saved-loading-info" />
    </SavingDialogText>
  </SavingDialog>
);
