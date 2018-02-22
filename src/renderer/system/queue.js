import ChannelQueue from '@buttercup/channel-queue';

let __queue;

export function getQueue() {
  if (!__queue) {
    __queue = new ChannelQueue();
    __queue.createParallelChannel('icons', 5);
  }
  return __queue;
}
