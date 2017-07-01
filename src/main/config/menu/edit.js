import { isOSX } from '../../lib/platform';

const menu = [
  { role: 'undo' },
  { role: 'redo' },
  { type: 'separator' },
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
  { role: 'pasteandmatchstyle' },
  { role: 'delete' },
  { role: 'selectall' }
];

if (isOSX()) {
  menu.push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    }
  );
}

export default menu;
