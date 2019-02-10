import { createGlobalStyle } from 'styled-components';
import '../styles/font/fonts.css';

export default createGlobalStyle`
  html {
    height: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    margin: 0;
    padding: 0;
    display: flex;
    height: 100%;
    overflow: hidden;
    -webkit-app-region: drag;
  }

  body, button, input, select, textarea {
    font: 1em/1.5 'Open Sans';
  }

  *, *:before, *:after {
    box-sizing: border-box;
  }

  #root {
    display: flex;
    flex: 1;
  }

  :not(input):not(textarea),
  :not(input):not(textarea)::after,
  :not(input):not(textarea)::before {
      -webkit-user-select: none;
      user-select: none;
  }

  [role="content"] {
    user-select: text;
    -webkit-user-select: text;
  }

  input, button, textarea, :focus {
      outline: none; // @TODO: a11y
      -webkit-app-region: no-drag;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate(-50%, -50%) translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate(-50%, -50%) translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate(-50%, -50%) translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate(-50%, -50%) translate3d(4px, 0, 0);
    }
  }

  :root {
    --spacing-half: 6px;
    --spacing-one: 12px;
    --spacing-two: 20px;
    --sidebar-width: 250px;
    --sidebar-width-condenced: 75px;
    --form-input-height: 35px;
    --password-input-height: 45px;
    --sidebar-bg: RGBA(33, 37, 43, .9);
    --groups-bg: #292C33;
    --groups-bg-mac: rgba(0,0,0,.2);
    --entries-bg: #31353D;
    --entries-bg-mac: rgba(0, 0, 0, .35);
    --modal-overlay: rgba(0,0,0,.40);
    --red: #EB5767;
    --gray-light: #F5F7FA;
    --gray: #E4E9F2;
    --gray-dark: #777;
    --gray-darker: #444;
    --black-5: rgba(0,0,0,.05);
    --black-10: rgba(0,0,0,.10);
    --black-20: rgba(0,0,0,.20);
    --black-35: rgba(0,0,0,.35);
    --white-5: rgba(255, 255, 255, 0.05);
    --brand-primary: #00B7AC;
    --brand-primary-darker: #179E94;
  }
`;
