import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Button } from '@buttercup/ui';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Translate } from '../../../shared/i18n';
import '../../styles/workspace.global.scss';
import { closeCurrentWindow } from '../../system/utils';

import { getSetting } from '../../../shared/selectors';

// router views
const preferencesFiles = require.context('./', true, /^\.\/.*\.js$/);
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

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  background-color: #fff;
`;

const Menu = styled.div`
  background-color: #eee;
  display: grid;
  grid-template-rows: 1fr auto;
`;

const MenuInner = styled.div`
  padding: 20px 20px 0;
  a {
    list-style: none;
    color: #999;
    text-decoration: none;
    padding: 20px;
    font-size: 13px;
    display: inline-block;
    position: relative;
    &.active {
      border-bottom: 2px solid #00b7ac;
    }
  }
`;

const Content = styled.div`
  padding: 20px;
  h3 {
    margin: 0 0 15px;
  }
`;
const Footer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  h3 {
    margin: 0 0 15px;
  }
`;

const Seperator = styled.div`
  display: block;
  font-size: 12px;
  color: #999;
  position: relative;
  padding: 0 20px 0;
  box-sizing: border-box;
  margin: 5px 0;
  &:before {
    border-top: 1px solid #c1c1c1;
    content: '';
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    width: 90%;
  }
  span {
    background-color: #eee;
    position: relative;
    padding: 0 10px;
    z-index: 2;
    margin-left: -15px;

    &:empty {
      padding: 0;
      &:before {
        display: none;
      }
    }
  }
`;

Seperator.propTypes = {
  text: PropTypes.string
};

class Preferences extends PureComponent {
  static propTypes = {
    t: PropTypes.func
  };

  handleClose() {
    closeCurrentWindow();
  }

  render() {
    const { t } = this.props;

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
        </Wrapper>
      </Router>
    );
  }
}

export default translate()(Preferences);
