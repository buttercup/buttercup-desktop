import { themes, VaultProvider, VaultUI } from '@buttercup/ui';
import '@buttercup/ui/dist/styles.css';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { createArchive, createArchiveFacade } from '../utils/mock';

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
`;

const App: React.FunctionComponent = () => {
  const archiveFacade = createArchiveFacade(createArchive());
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={themes.light}>
        <VaultProvider
          vault={archiveFacade}
          onUpdate={(vault: any) => {
            console.log('Saving vault...');
            // setArchiveFacade(processVaultUpdate(archive, vault));
            console.log('HELLO');
          }}
        >
          <VaultUI />
        </VaultProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
