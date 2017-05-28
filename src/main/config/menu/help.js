import { shell } from 'electron';
import pkg from '../../../../package.json';

export default [
  {
    label: 'Visit Our Website',
    click: () => {
      shell.openExternal('https://buttercup.pw');
    }
  },
  {
    label: 'Privacy Policy',
    click: () => {
      shell.openExternal('https://buttercup.pw/privacy');
    }
  },
  {
    label: `View Changelog For v${pkg.version}`,
    click: () => {
      shell.openExternal(`https://github.com/buttercup/buttercup/releases/tag/v${pkg.version}`);
    }
  }
];
