import React from 'react';
import { ipcRenderer as ipc, remote } from 'electron';
import { I18nextProvider } from 'react-i18next';
import { render } from 'react-dom';
import styled from 'styled-components';
import { Flex } from 'styled-flexbox';
import { Button } from '@buttercup/ui';
import i18n, { Translate } from '../shared/i18n';
import { isOSX } from '../shared/utils/platform';
import configureStore from '../shared/store/configure-store';
import { getSetting } from '../shared/selectors';
import GlobalStyles from './components/global-styles';

const store = configureStore({}, 'renderer');
i18n.changeLanguage(getSetting(store.getState(), 'locale'));

const Wrapper = styled(Flex)`
  height: 100vh;
  width: 100vw;
  padding: var(--spacing-one);
  color: #fff;

  p {
    margin: 0 0 var(--spacing-half);
    text-align: center;
    font-size: 0.8rem;
  }
`;

const Code = styled.pre`
  background-color: ${isOSX() ? 'transparent' : 'var(--entries-bg-mac)'};
  flex: 1;
  padding: 0 var(--spacing-one);
  border: 1px solid var(--white-5);
  border-radius: 1rem;
  margin: 0 0 var(--spacing-one);
  text-align: center;
  letter-spacing: 2rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    transform: translateX(1rem);
  }
`;

const renderWindow = connectionCode =>
  render(
    <>
      <I18nextProvider i18n={i18n}>
        <Wrapper flexColumn>
          <Translate
            i18nKey="app-menu.system.enable-browser-access"
            parent="p"
          />
          <Code>
            <span role="content">{connectionCode}</span>
          </Code>
          <Button
            dark
            onClick={() => {
              remote.getCurrentWindow().close();
            }}
          >
            <Translate i18nKey="entry.cancel" parent="span" />
          </Button>
        </Wrapper>
      </I18nextProvider>
      <GlobalStyles />
    </>,
    document.getElementById('root')
  );

renderWindow('');

ipc.send('file-host-connection-init');

ipc.on('code-ready', (e, payload) => {
  renderWindow(payload);
});
