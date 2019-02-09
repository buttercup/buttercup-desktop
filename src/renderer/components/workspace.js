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

const RequestTypes = {
  UNLOCK: 'unlock',
  PASSWORD_CHANGE: 'change',
  NEW_VAULT: 'new'
};

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
    onUnlockArchive: PropTypes.func,
    onAddNewVault: PropTypes.func
  };

  state = {
    modalRequest: null,
    unlockRequest: null,
    passwordChangeRequest: null
  };

  componentDidMount() {
    ipc.on('load-archive', (e, payload) => {
      this.setState({
        modalRequest: {
          type: RequestTypes.NEW_VAULT,
          confirm: payload.isNew,
          payload
        }
      });
    });

    ipc.on('set-current-archive', (e, payload) => {
      this.setState({
        modalRequest: {
          type: RequestTypes.UNLOCK,
          confirm: false,
          payload
        }
      });
    });
  }

  handleUnlockSuccess = () => {
    this.setState({
      modalRequest: null
    });
  };

  handlePasswordModalCancel = () => {
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
      onUnlockArchive,
      onAddNewVault
    } = this.props;

    const onValidate = modalRequest => {
      const { payload, type } = modalRequest;
      return password => {
        switch (type) {
          case RequestTypes.UNLOCK:
            return onUnlockArchive(payload, password);
          case RequestTypes.NEW_VAULT:
            return onAddNewVault(payload, password);
        }
      };
    };

    return (
      <React.Fragment>
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
        <If condition={this.state.modalRequest !== null}>
          <PasswordModal
            onValidate={onValidate(this.state.modalRequest)}
            onCancel={this.handlePasswordModalCancel}
            onSuccess={this.handleUnlockSuccess}
          />
        </If>
      </React.Fragment>
    );
  }
}

export default Workspace;
