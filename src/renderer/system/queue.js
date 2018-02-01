import uuid from 'uuid';
import { ipcRenderer as ipc } from 'electron';

export function enqueue(channelName, fn, stack) {
  const id = uuid.v4();

  ipc.once(`channel:execute:${id}`, async () => {
    const output = fn();
    if (output instanceof Promise) {
      await output;
    }
    ipc.send(`channel:resolve:${id}`);
  });

  ipc.send('channel:enqueue', {
    channelName,
    stack,
    id
  });
}
