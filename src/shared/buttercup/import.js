import { consumeVaultFacade } from './buttercup';
import { getArchive, saveWorkspace } from './archive';

export function importVaultFacade(archiveId, vaultFacade) {
  const vault = getArchive(archiveId);
  consumeVaultFacade(vault, vaultFacade, {
    mergeMode: true
  });
  saveWorkspace(archiveId);
}
