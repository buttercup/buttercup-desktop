import uuid from 'uuid';
import { ipcRenderer as ipc } from 'electron';

export function enqueue(channelName, fn, stack) {
  const id = uuid.v4();

  ipc.once(`channel:execute:${id}`, () => {
    const output = fn();
    const result = output instanceof Promise ? output : Promise.resolve(output);
    result.then(() => ipc.send(`channel:resolve:${id}`));
  });

  ipc.send('channel:enqueue', {
    channelName,
    stack,
    id
  });
}
