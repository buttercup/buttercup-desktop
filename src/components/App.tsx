import { Classes } from '@blueprintjs/core';
import { VaultProvider, VaultUI } from '@buttercup/ui';
import '@buttercup/ui/dist/styles.css';
import type Vault from 'core/Vault';
import { remote } from 'electron';
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import * as themes from '../styles/theme';
import { createArchive, createArchiveFacade } from '../utils/mock';

const { nativeTheme } = remote;

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100vh;
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }

  .layout-splitter {
    -webkit-app-region: no-drag;
  }
`;

const GlobalWrapper = styled.div`
  height: 100%;
  background-color: ${(p) => p.theme.backgroundColor};
`;

const App: React.FunctionComponent = () => {
  const [darkMode, setDarkMode] = useState(nativeTheme.shouldUseDarkColors);
  const archiveFacade = createArchiveFacade(createArchive());

  useEffect(() => {
    const callback = () => {
      setDarkMode(nativeTheme.shouldUseDarkColors);
    };
    nativeTheme.on('updated', callback);
    return () => {
      nativeTheme.off('updated', callback);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={darkMode ? themes.dark : themes.light}>
        <GlobalWrapper className={darkMode ? Classes.DARK : ''}>
          <VaultProvider
            vault={archiveFacade}
            onUpdate={(vault: Vault) => {
              console.log('Saving vault...', vault);
            }}
          >
            <VaultUI renderGroupsPaneTitle={() => <div />} />
          </VaultProvider>
        </GlobalWrapper>
      </ThemeProvider>
    </>
  );
};

export default App;
