import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { getCurrentSourceID, setCurrentVault } from "../state/vaults";

export async function removeVaultSource(sourceID: VaultSourceID) {
    if (sourceID === getCurrentSourceID()) {
        setCurrentVault(null);
    }
    ipcRenderer.send(
        "remove-source",
        JSON.stringify({
            sourceID
        })
    );
}
