import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Button } from '@buttercup/ui';
import '@buttercup/ui/dist/styles.css';

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <>
        <h1>Hello Siree</h1>
        <Button>Hello!</Button>
      </>
    </AppContainer>,
    document.getElementById('root')
  )
);
