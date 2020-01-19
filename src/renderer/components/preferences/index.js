import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { translate } from 'react-i18next';
import * as eva from 'eva-icons';
import GlobalStyles from '../../components/global-styles';
import { Wrapper, Menu, MenuInner, Content } from './components/ui-elements';
import { IconStyles } from '../icon';
import { Translate } from '../../../shared/i18n';

// router views
const views = {
  general: {
    component: lazy(() => import('./general')),
    icon: 'options-outline',
    default: true
  },
  shortcuts: {
    component: lazy(() => import('./shortcuts')),
    icon: 'book-open-outline',
    default: false
  }
};

const Preferences = props => {
  useEffect(() => {
    eva.replace();
  }, []);

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
                <i data-eva={views[view].icon} data-eva-fill="currentColor" />
                <Translate i18nKey={`preferences.${view}`} parent="div" />
              </NavLink>
            ))}
          </MenuInner>
        </Menu>

        <Scrollbars style={{ display: 'flex' }}>
          <Content>
            <Suspense fallback="">
              {Object.keys(views).map(key => (
                <Route
                  key={key}
                  exact
                  path={'/' + (views[key].default ? '' : key)}
                  render={viewProps => {
                    const Component = views[key].component;
                    return <Component {...props} {...viewProps} />;
                  }}
                />
              ))}
            </Suspense>
          </Content>
        </Scrollbars>
        <GlobalStyles />
        <IconStyles />
      </Wrapper>
    </Router>
  );
};

export default translate()(Preferences);
