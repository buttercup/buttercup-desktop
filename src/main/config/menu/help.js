import { shell } from 'electron';

export default [
  {
    label: 'Learn More',
    click: () => {
      shell.openExternal('https://buttercup.pw');
    }
  }
];
