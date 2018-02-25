import path from 'path';

export function getPathToFile(fileName) {
  return `file://${getURIPathToFile(fileName)}`;
}

export function getURIPathToFile(fileName) {
  if (process.env.NODE_ENV === 'development') {
    return `${path.join(__dirname, `../../../app/${fileName}`)}`;
  }
  return `${path.join(__dirname, `../${fileName}`)}`;
}
