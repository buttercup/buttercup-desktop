import React, { Component } from 'react';
import { ipcRenderer as ipc } from 'electron';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
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

export default class SavingModal extends Component {
  state = {
    isSaving: false
  };

  componentDidMount() {
    ipc.on('save-started', () => {
      this.setState({ isSaving: true });
    });
    ipc.on('save-completed', () => {
      this.setState({ isSaving: false });
    });
  }

  componentWillUnmount() {
    ipc.removeAllListeners('save-started');
    ipc.removeAllListeners('save-completed');
  }

  render() {
    if (this.state.isSaving === false) {
      return null;
    }
    return (
      <SavingDialog align="center" justify="center">
        <SavingDialogText>
          <img width="64" src={spinner} alt="Loading" />
          <p>
            Your archive is being saved.<br />Exiting automatically...
          </p>
        </SavingDialogText>
      </SavingDialog>
    );
  }
}
