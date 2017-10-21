import ms from 'ms';

export function sleep(duration) {
  if (typeof duration === 'string') {
    duration = ms(duration);
  }
  return new Promise(resolve => setTimeout(resolve, duration));
}
