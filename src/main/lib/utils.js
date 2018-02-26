import path from 'path';

export function getURIPathToFile(fileName) {
  return `file://${getURIPathToFile(fileName)}`;
}

export function getPathToFile(fileName) {
  if (process.env.NODE_ENV === 'development') {
    return `${path.join(__dirname, `../../../app/${fileName}`)}`;
  }
  return `${path.join(__dirname, `../${fileName}`)}`;
}
