import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";

export async function removeVaultSource(sourceID: VaultSourceID) {
    ipcRenderer.send(
        "remove-source",
        JSON.stringify({
            sourceID
        })
    );
}
