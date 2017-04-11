import path from 'path';

export function getPathToFile(fileName) {
  if (process.env.NODE_ENV === 'development') {
    return `file://${path.resolve(__dirname, `../../../app/${fileName}`)}`;
  }
  return `file://${path.resolve(__dirname, `../${fileName}`)}`;
}
