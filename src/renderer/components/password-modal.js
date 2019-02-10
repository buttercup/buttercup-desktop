import React, { PureComponent } from 'react';
import isError from 'is-error';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Input as BaseInput, Button } from '@buttercup/ui';
import { Translate } from '../../shared/i18n';

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

const initialState = {
  password: '',
  errorMessage: null,
  loading: false
};

class PasswordModal extends PureComponent {
  static propTypes = {
    onValidate: PropTypes.func,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    t: PropTypes.func
    // confirmPassword: PropTypes.bool
  };

  state = {
    ...initialState
  };

  componentDidMount() {
    this.setState({ ...initialState });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { onValidate, onSuccess, t } = this.props;
    this.setState(
      {
        loading: true
      },
      () => {
        onValidate(this.state.password)
          .then(() => {
            onSuccess();
          })
          .catch(err => {
            const unknownMessage = t('error.unknown');
            this.setState({
              errorMessage: isError(err)
                ? err.message || unknownMessage
                : unknownMessage,
              loading: false
            });
          });
      }
    );
  };

  handlePasswordChange = e => {
    this.setState({
      password: e.target.value,
      errorMessage: null
    });
  };

  render() {
    const { errorMessage, loading, password } = this.state;
    const { t } = this.props;
    return (
      <Modal
        style={{
          overlay: {
            backgroundColor: 'var(--modal-overlay)'
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
        <Translate i18nKey="password-dialog.master-password" parent={Title} />
        <form onSubmit={this.handleSubmit}>
          <Input
            bordered
            className={errorMessage !== null ? 'has-error' : null}
            type="password"
            placeholder={`${t('password-dialog.password')}...`}
            autoFocus
            value={password}
            onChange={this.handlePasswordChange}
            disabled={loading}
          />
          <If condition={errorMessage}>
            <p>{errorMessage}</p>
          </If>
          <Button type="submit" full primary large disabled={loading}>
            <Translate i18nKey="password-dialog.confirm" parent="span" />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default translate()(PasswordModal);
