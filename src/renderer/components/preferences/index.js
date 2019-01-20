import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';

import { Translate } from '../../../shared/i18n';
import '../../styles/workspace.global.scss';
import { closeCurrentWindow } from '../../system/utils';

import { Wrapper, Menu, MenuInner, Content } from './ui-elements';

// router views
const preferencesFiles = require.context('./', true, /^\.\/(?!_).*\.js$/);
const defaultView = 'general';
const views = preferencesFiles
  .keys()
  .filter(
    fileName =>
      !fileName.includes('index') && preferencesFiles(fileName).default
  )
  .map(fileName => {
    const component = preferencesFiles(fileName).default;
    const key = fileName.substr(0, fileName.lastIndexOf('.')).replace('./', '');

    if (component) {
      return {
        key,
        path: key === defaultView ? '/' : `/${key}`,
        component
      };
    }
  })
  .reverse();

class Preferences extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  handleClose() {
    closeCurrentWindow();
  }

  render() {
    return (
      <Router>
        <Wrapper>
          <Menu>
            <MenuInner>
              {views.map(view => (
                <NavLink
                  key={view.path}
                  exact
                  to={view.path}
                  activeclass="active"
                >
                  <Translate
                    i18nKey={`preferences.${view.key}`}
                    parent="span"
                  />
                </NavLink>
              ))}
            </MenuInner>
          </Menu>

          <Scrollbars style={{ display: 'flex' }}>
            <Content>
              {views.map(({ key, path, component: Component }) => (
                <Route
                  key={key}
                  exact
                  path={path}
                  render={props => <Component {...this.props} {...props} />}
                />
              ))}
            </Content>
          </Scrollbars>
        </Wrapper>
      </Router>
    );
  }
}

export default translate()(Preferences);
