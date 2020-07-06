import { consumeVaultFacade } from './buttercup';
import { getArchive, saveWorkspace } from './archive';

export function importVaultFacade(sourceID, vaultFacade) {
  const vault = getArchive(sourceID);
  consumeVaultFacade(vault, vaultFacade, {
    mergeMode: true
  });
  saveWorkspace(sourceID);
}
