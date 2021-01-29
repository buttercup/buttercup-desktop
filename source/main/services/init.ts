import { attachVaultManagerWatchers, loadVaultsFromDisk } from "./buttercup";

export async function initialise() {
    attachVaultManagerWatchers();
    await loadVaultsFromDisk()
}
