import { isOSX } from '../../lib/platform';

const menu = [
  { role: 'minimize' },
  { role: 'close' },
  { type: 'separator' },
  { role: 'front' }
];

if (isOSX()) {
  menu.push(
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' }
  );
}

export default menu;
