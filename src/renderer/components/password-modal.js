import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Input as BaseInput, Button } from '@buttercup/ui';

const Input = styled(BaseInput)`
  font-size: 18px;
  padding: 0 var(--spacing-one);
  height: var(--password-input-height);
  margin-bottom: var(--spacing-one);
  display: block;

  &.has-error {
    border-color: var(--red);
  }
`;

const Title = styled.h2`
  text-align: center;
  margin: 0 0 var(--spacing-two);
  color: var(--gray-darker);
`;

Modal.setAppElement('#root');

class PasswordModal extends PureComponent {
  static propTypes = {
    onValidate: PropTypes.func,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func
  };

  state = {
    password: '',
    errorMessage: null
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props
      .onValidate(this.state.password)
      .then(() => {
        console.log('Validated');
        this.props.onSuccess();
      })
      .catch(err => {
        this.setState({
          errorMessage: err.message
        });
      });
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value,
      errorMessage: null
    });
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <Modal
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          },
          content: {
            width: '450px',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%) translate3d(0, 0, 0)',
            animation: errorMessage
              ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
              : null,
            padding: 'var(--spacing-two)'
          }
        }}
        isOpen
        onRequestClose={this.props.onCancel}
      >
        <Title>Master Password</Title>
        <form onSubmit={this.handleSubmit}>
          <Input
            bordered
            className={errorMessage !== null ? 'has-error' : null}
            type="password"
            placeholder="Password..."
            autoFocus
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <If condition={errorMessage}>
            <p>{errorMessage}</p>
          </If>
          <Button type="submit" full primary large>
            Submit
          </Button>
        </form>
      </Modal>
    );
  }
}

export default PasswordModal;
