import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { translate } from 'react-i18next';
import orderBy from 'lodash/orderBy';
import * as eva from 'eva-icons';

import { Translate } from '../../../shared/i18n';
import '../../styles/workspace.global.scss';
import { closeCurrentWindow } from '../../system/utils';

import { Wrapper, Menu, MenuInner, Content } from './ui-elements';

// router views
const preferencesFiles = require.context('./', true, /^\.\/(?!_).*\.js$/);
const defaultView = 'general';
const views = orderBy(
  preferencesFiles
    .keys()
    .filter(
      fileName =>
        !fileName.includes('index') && preferencesFiles(fileName).default
    )
    .map(fileName => {
      const component = preferencesFiles(fileName).default;
      const key = fileName
        .substr(0, fileName.lastIndexOf('.'))
        .replace('./', '');

      if (component) {
        return {
          key,
          path: key === defaultView ? '/' : `/${key}`,
          component
        };
      }
    }),
  [{ key: defaultView }],
  ['desc']
);

class Preferences extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  icons = {
    general: 'options-outline',
    shortcuts: 'book-open-outline'
  };

  handleClose() {
    closeCurrentWindow();
  }

  componentDidMount() {
    eva.replace();
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
                  <i data-eva={this.icons[view.key]} data-eva-fill="white" />
                  <Translate i18nKey={`preferences.${view.key}`} parent="div" />
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
