import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Button, ButtonRow } from '@buttercup/ui';
import { Flex } from 'styled-flexbox';
import styled from 'styled-components';
import { brands } from '../../../shared/buttercup/brands';
import { Translate } from '../../../shared/i18n';
import '../../styles/workspace.global.scss';
import {
  emitActionToParentAndClose,
  closeCurrentWindow
} from '../../system/utils';
import TypeSelector from './type-selector';
import Dropbox from './sources/dropbox';
import Webdav from './sources/webdav';

const Wrapper = styled(Flex)`
  background-color: #fff;
`;

const Footer = styled(Flex)`
  flex: 0 0 50px;
  padding: var(--spacing-one);
  background-color: var(--gray-light);
`;

const PathRenderer = ({ pathName, ...props }) => {
  switch (pathName) {
    case '/dropbox':
      return <Dropbox {...props} />;
    case '/owncloud':
      return <Webdav brand="owncloud" {...props} />;
    case '/nextcloud':
      return <Webdav brand="nextcloud" {...props} />;
    case '/webdav':
      return <Webdav {...props} />;
    default:
      return null;
  }
};

PathRenderer.propTypes = {
  pathName: PropTypes.string
};

class FileManager extends PureComponent {
  state = {
    selectedConfig: null,
    creatable: false
  };

  handleSelectFile = config => {
    this.setState({
      selectedConfig: config
    });
  };

  handleOpenClick = () => {
    emitActionToParentAndClose('load-archive', this.state.selectedConfig);
  };

  handleCreateClick = () => {
    document.dispatchEvent(new Event('new-archive-clicked'));
  };

  toggleCreateButton = toggle => {
    this.setState({
      creatable: toggle
    });
  };

  handleClose() {
    closeCurrentWindow();
  }

  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.which === 27 && e.target.tagName.toLowerCase() !== 'input') {
        this.handleClose();
      }
    });
  }

  renderPath = ({ match }) => {
    return (
      <PathRenderer
        pathName={match.path}
        onSelect={this.handleSelectFile}
        toggleCreateButton={this.toggleCreateButton}
      />
    );
  };

  render() {
    return (
      <Router>
        <Wrapper flexAuto flexColumn>
          <Flex flexAuto>
            <Route exact path="/" component={TypeSelector} />
            {Object.keys(brands).map(brand => (
              <Route key={brand} path={`/${brand}`} render={this.renderPath} />
            ))}
          </Flex>
          <Footer>
            <Flex align="center" width="50%">
              <ButtonRow>
                <Button onClick={this.handleClose}>
                  <Translate i18nKey="cloud-source.cancel" parent="span" />
                </Button>
                <NavLink exact to="/" activeStyle={{ display: 'none' }}>
                  <Button>
                    <Translate i18nKey="cloud-source.go-back" parent="span" />
                  </Button>
                </NavLink>
              </ButtonRow>
            </Flex>
            <Flex justify="flex-end" align="center" width="50%">
              <ButtonRow>
                <Button
                  disabled={!this.state.creatable}
                  onClick={this.handleCreateClick}
                >
                  <Translate i18nKey="cloud-source.new-archive" parent="span" />
                </Button>
                <Button
                  primary
                  disabled={this.state.selectedConfig === null}
                  onClick={this.handleOpenClick}
                >
                  <Translate
                    i18nKey="cloud-source.open-in-buttercup"
                    parent="span"
                  />
                </Button>
              </ButtonRow>
            </Flex>
          </Footer>
        </Wrapper>
      </Router>
    );
  }
}

export default FileManager;
