import { ipcMain as ipc } from 'electron';
import ChannelQueue from '@buttercup/channel-queue';

let __queue;

export function getQueue() {
  if (!__queue) {
    __queue = new ChannelQueue();
  }
  return __queue;
}

ipc.on('channel:enqueue', (e, payload) => {
  const { channelName, stack, id } = payload;
  getQueue()
    .channel(channelName)
    .enqueue(
      () => {
        return new Promise(resolve => {
          ipc.once(`channel:resolve:${id}`, resolve);
          e.sender.webContents.send(`channel:execute:${id}`);
        });
      },
      undefined,
      stack
    );
});
