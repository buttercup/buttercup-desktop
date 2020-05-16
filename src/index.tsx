import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  )
);
