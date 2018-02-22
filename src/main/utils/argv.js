export function getFilePathFromArgv(argv) {
  if (Array.isArray(argv) && argv.length > 1 && typeof argv[1] === 'string') {
    return argv[1];
  }
}
