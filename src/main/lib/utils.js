import path from 'path';

export function getPathToFile(fileName, disableFilePath = false) {
  if (process.env.NODE_ENV === 'development') {
    return `${disableFilePath ? '/' : 'file://'}${path.resolve(
      __dirname,
      `../../../app/${fileName}`
    )}`;
  }
  return `${disableFilePath ? '/' : 'file://'}${path.resolve(
    __dirname,
    `../${fileName}`
  )}`;
}
