import React, { PureComponent } from 'react';
import isError from 'is-error';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Input as BaseInput, Button, Meter } from '@buttercup/ui';
import { MdWarning as ErrorIcon } from 'react-icons/md';
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

const ErrorContainer = styled.div`
  background-color: var(--gray-light);
  border-radius: 3px;
  padding: var(--spacing-one);
  color: var(--gray-darker);
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin: 0 0 0 var(--spacing-half);
  }

  svg {
    color: var(--red);
  }
`;

const ButtonWrapper = styled.div`
  margin-top: var(--spacing-one);
`;

Modal.setAppElement('#root');

const initialState = {
  oldPassword: '',
  password: '',
  passwordConfirmation: '',
  passwordSubmitted: false,
  oldPasswordSubmitted: false,
  errorMessage: null,
  loading: false
};

class PasswordModal extends PureComponent {
  _currentInputRef = null;
  _mounted = false;

  static propTypes = {
    onValidate: PropTypes.func,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    t: PropTypes.func,
    confirmPassword: PropTypes.bool,
    askForOldPassword: PropTypes.bool
  };

  state = {
    ...initialState
  };

  setState(...props) {
    if (this._mounted) {
      return super.setState(...props);
    }
  }

  componentDidMount() {
    this._mounted = true;
    this.setState({ ...initialState });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleFormSubmit = e => {
    e.preventDefault();
    const { confirmPassword, askForOldPassword, t } = this.props;
    const {
      password,
      passwordConfirmation,
      passwordSubmitted,
      oldPasswordSubmitted
    } = this.state;

    // No confirmation needed, validate the form
    if (!confirmPassword && !askForOldPassword) {
      return this.handleSubmit();
    }

    // Render password
    if (askForOldPassword && !oldPasswordSubmitted) {
      return this.setState({
        oldPasswordSubmitted: true
      });
    }

    // Render password confirmation
    if (!passwordSubmitted) {
      return this.setState({
        passwordSubmitted: true
      });
    }

    // Check if passwords are the same
    if (password === passwordConfirmation) {
      return this.handleSubmit();
    }

    // If not, show an error
    this.setState({
      errorMessage: t('error.passwords-dont-match'),
      password: '',
      passwordConfirmation: '',
      passwordSubmitted: false
    });
  };

  handleSubmit = () => {
    const { onValidate, onSuccess, t } = this.props;
    this.setState(
      {
        loading: true
      },
      () => {
        onValidate(this.state.password, this.state.oldPassword)
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
            if (this._currentInputRef) {
              this._currentInputRef.focus();
              this._currentInputRef.select();
            }
          });
      }
    );
  };

  handlePasswordChange = (e, field) => {
    this.setState({
      [field]: e.target.value,
      errorMessage: null
    });
  };

  render() {
    const {
      errorMessage,
      loading,
      password,
      passwordConfirmation,
      passwordSubmitted,
      oldPassword,
      oldPasswordSubmitted
    } = this.state;
    const { t, confirmPassword, askForOldPassword } = this.props;
    const mainTitleKey = confirmPassword
      ? 'password-dialog.new-password'
      : 'password-dialog.master-password';
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
        onRequestClose={loading ? () => {} : this.props.onCancel}
      >
        <Translate
          i18nKey={
            askForOldPassword && !oldPasswordSubmitted
              ? 'password-dialog.master-password'
              : !passwordSubmitted
              ? mainTitleKey
              : 'password-dialog.confirm-password'
          }
          parent={Title}
        />
        <form onSubmit={this.handleFormSubmit}>
          <Choose>
            <When condition={askForOldPassword && !oldPasswordSubmitted}>
              <Input
                bordered
                className={errorMessage !== null ? 'has-error' : null}
                type="password"
                placeholder={`${t('password-dialog.master-password')}...`}
                autoFocus
                value={oldPassword}
                onChange={e => this.handlePasswordChange(e, 'oldPassword')}
                disabled={loading}
                ref={input => {
                  this._currentInputRef = input;
                }}
              />
            </When>
            <When condition={!passwordSubmitted}>
              <Input
                bordered
                className={errorMessage !== null ? 'has-error' : null}
                type="password"
                placeholder={`${t('password-dialog.password')}...`}
                autoFocus
                value={password}
                onChange={e => this.handlePasswordChange(e, 'password')}
                disabled={loading}
                ref={input => {
                  this._currentInputRef = input;
                }}
              />
              <If condition={confirmPassword}>
                <Meter input={password} />
              </If>
            </When>
            <Otherwise>
              <Input
                bordered
                className={errorMessage !== null ? 'has-error' : null}
                type="password"
                placeholder={`${t('password-dialog.confirm-password')}...`}
                autoFocus
                value={passwordConfirmation}
                onChange={e =>
                  this.handlePasswordChange(e, 'passwordConfirmation')
                }
                disabled={loading}
                ref={input => {
                  this._currentInputRef = input;
                }}
              />
            </Otherwise>
          </Choose>
          <If condition={errorMessage}>
            <ErrorContainer>
              <ErrorIcon />
              <p>{errorMessage}</p>
            </ErrorContainer>
          </If>
          <ButtonWrapper>
            <Button type="submit" full primary large disabled={loading}>
              <Translate i18nKey="password-dialog.confirm" parent="span" />
            </Button>
          </ButtonWrapper>
        </form>
      </Modal>
    );
  }
}

export default translate()(PasswordModal);
