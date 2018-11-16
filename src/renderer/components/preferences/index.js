import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Button } from '@buttercup/ui';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import { Translate } from '../../../shared/i18n';
import '../../styles/workspace.global.scss';
import { closeCurrentWindow } from '../../system/utils';

// router views
import General from './general';

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
  padding: 0 20px;
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
              <NavLink exact to="/" activeclass="active">
                <Translate i18nKey="preferences.general" parent="span" />
              </NavLink>
              <NavLink exact to="/appereance" activeclass="active">
                <Translate i18nKey="preferences.appereance" parent="span" />
              </NavLink>
            </MenuInner>
          </Menu>
          <Content>
            <Route exact path="/" component={General} />
          </Content>
          <Footer>
            <Button onClick={this.handleClose}>
              {t('app-menu.archive.close')}
            </Button>
            <Button primary>{t('entry.save')}</Button>
          </Footer>
        </Wrapper>
      </Router>
    );
  }
}

export default translate()(Preferences);
