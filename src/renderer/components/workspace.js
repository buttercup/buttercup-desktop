import PropTypes from 'prop-types';
import { ipcRenderer as ipc } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import Archive from '../components/archive';
import Sidebar from '../containers/sidebar';
import GlobalStyles from './global-styles';
import SavingModal from './saving-modal';
import ArchiveSearch from '../containers/archive/archive-search';
import { NoArchiveSelected, WelcomeScreen } from './empty-view';
import spinner from '../styles/img/spinner.svg';
import PasswordModal from './password-modal';
import { PasswordDialogRequestTypes } from '../../shared/buttercup/types';

const Primary = styled(Flex)`
  position: relative;
`;

class Workspace extends PureComponent {
  static propTypes = {
    currentArchive: PropTypes.object,
    archivesCount: PropTypes.number,
    columnSizes: PropTypes.object,
    condencedSidebar: PropTypes.bool,
    archivesLoading: PropTypes.bool,
    savingArchive: PropTypes.bool,
    isArchiveSearchVisible: PropTypes.bool,
    setColumnSize: PropTypes.func,
    isVaultUnlocked: PropTypes.func,
    onValidate: PropTypes.func
  };

  state = {
    modalRequest: null
  };

  componentDidMount() {
    ipc.on('load-archive', (e, payload) => {
      this.setState({
        modalRequest: {
          type: PasswordDialogRequestTypes.NEW_VAULT,
          confirm: payload.isNew,
          payload
        }
      });
    });

    ipc.on('vault-set-current', (e, payload) => {
      const modalRequest = {
        type: PasswordDialogRequestTypes.UNLOCK,
        confirm: false,
        payload
      };
      if (this.props.isVaultUnlocked(payload)) {
        return this.props.onValidate(modalRequest);
      }
      this.setState({
        modalRequest
      });
    });

    ipc.on('vault-password-change', (e, payload) => {
      this.setState({
        modalRequest: {
          type: PasswordDialogRequestTypes.PASSWORD_CHANGE,
          confirm: true,
          payload
        }
      });
    });

    ipc.on('import-history-prompt', (e, payload) => {
      this.setState({
        modalRequest: {
          type: PasswordDialogRequestTypes.IMPORT,
          confirm: false,
          payload
        }
      });
    });

    ipc.send('init');
  }

  handlePasswordModalClose = () => {
    this.setState({
      modalRequest: null
    });
  };

  render() {
    const {
      currentArchive,
      archivesCount,
      setColumnSize,
      columnSizes,
      condencedSidebar,
      archivesLoading,
      savingArchive,
      isArchiveSearchVisible,
      onValidate
    } = this.props;
    const { modalRequest } = this.state;

    return (
      <>
        <GlobalStyles />
        <Flex flexAuto>
          <If condition={archivesCount > 0}>
            <Sidebar condenced={condencedSidebar} />
          </If>
          <Primary flexAuto>
            <Choose>
              <When condition={archivesLoading}>
                <Flex align="center" justify="center" flexColumn flexAuto>
                  <img width="64" src={spinner} alt="Loading" />
                </Flex>
              </When>
              <Otherwise>
                <Choose>
                  <When condition={archivesCount === 0}>
                    <WelcomeScreen />
                  </When>
                  <When
                    condition={archivesCount > 0 && currentArchive === null}
                  >
                    <NoArchiveSelected />
                  </When>
                  <Otherwise>
                    <Archive
                      columnSizes={columnSizes}
                      onColumnSizeChange={setColumnSize}
                    />
                  </Otherwise>
                </Choose>
              </Otherwise>
            </Choose>
          </Primary>
          <If condition={isArchiveSearchVisible}>
            <ArchiveSearch />
          </If>
          <If condition={savingArchive}>
            <SavingModal />
          </If>
        </Flex>
        <If condition={modalRequest !== null}>
          <PasswordModal
            onValidate={password => onValidate(modalRequest, password)}
            onCancel={this.handlePasswordModalClose}
            onSuccess={this.handlePasswordModalClose}
            confirmPassword={modalRequest.confirm}
          />
        </If>
      </>
    );
  }
}

export default Workspace;
