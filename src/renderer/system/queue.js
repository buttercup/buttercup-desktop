import uuid from 'uuid';
import { ipcRenderer as ipc } from 'electron';
import ChannelQueue from '@buttercup/channel-queue';

let __queue;

export function getQueue() {
  if (!__queue) {
    __queue = new ChannelQueue();
    __queue.createParallelChannel('icons', 5);
  }
  return __queue;
}

export function enqueueInMain(channelName, fn, stack) {
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
