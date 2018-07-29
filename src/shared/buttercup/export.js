import fs from 'fs';
import { remote } from 'electron';
import { exportArchiveToCSV } from '@buttercup/exporter';
import { getArchive } from './archive';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();

export function exportArchiveToCSVAndSave(archiveId) {
  const archive = getArchive(archiveId);
  if (!archive) {
    throw new Error(`No archive with ID ${archiveId} has been found.`);
  }
  const fileName = dialog.showSaveDialog(currentWindow, {
    filters: [
      {
        name: 'Buttercup Export File',
        extensions: ['csv']
      }
    ]
  });
  if (!fileName) {
    return;
  }

  return exportArchiveToCSV(archive).then(csv => {
    fs.writeFileSync(fileName, csv, {
      encoding: 'utf8'
    });
  });
}
