import { ipcMain as ipc } from 'electron';
import fs from 'fs-extra';

ipc.on('read-archive', (event, arg) => {
  fs.ensureFileSync(arg);
  event.returnValue = fs.readFileSync(arg).toString('utf-8');
});

ipc.on('write-archive', (event, arg) => {
  fs.outputFileSync(arg.filename, arg.content);
  event.returnValue = true;
});
