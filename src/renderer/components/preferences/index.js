import React, { PureComponent } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { translate } from 'react-i18next';
import GlobalStyles from '../../components/global-styles';
import { IconStyles } from '../icon';
import * as eva from 'eva-icons';

import { Translate } from '../../../shared/i18n';

import { Wrapper, Menu, MenuInner, Content } from './elements/ui-elements';

// router views
const views = {
  general: {
    component: require('./general').default,
    icon: 'options-outline',
    default: true
  },
  shortcuts: {
    component: require('./shortcuts').default,
    icon: 'book-open-outline',
    default: false
  }
};

class Preferences extends PureComponent {
  componentDidMount() {
    eva.replace();
  }

  render() {
    return (
      <Router>
        <Wrapper>
          <Menu>
            <MenuInner>
              {Object.keys(views).map(view => (
                <NavLink
                  key={view}
                  exact
                  to={'/' + (views[view].default ? '' : view)}
                  activeclass="active"
                >
                  <i data-eva={views[view].icon} data-eva-fill="white" />
                  <Translate i18nKey={`preferences.${view}`} parent="div" />
                </NavLink>
              ))}
            </MenuInner>
          </Menu>

          <Scrollbars style={{ display: 'flex' }}>
            <Content>
              {Object.keys(views).map(key => (
                <Route
                  key={key}
                  exact
                  path={'/' + (views[key].default ? '' : key)}
                  render={props =>
                    React.createElement(views[key].component, {
                      ...this.props,
                      ...props
                    })
                  }
                />
              ))}
            </Content>
          </Scrollbars>
          <GlobalStyles />
          <IconStyles />
        </Wrapper>
      </Router>
    );
  }
}

export default translate()(Preferences);
