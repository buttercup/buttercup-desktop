export function isOSX() {
  return process.platform === 'darwin';
}

// Temporary fix for High Sierra. See #339
export function isHighSierra() {
  return (
    process.platform === 'darwin' &&
    Number(
      require('os')
        .release()
        .split('.')[0]
    ) >= 17
  );
}

export function isWindows() {
  return process.platform === 'win32';
}

export function isLinux() {
  return process.platform === 'linux';
}

export default {
  isOSX,
  isWindows,
  isLinux
};
