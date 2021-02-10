import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";

export async function lockVaultSource(sourceID: VaultSourceID) {
    ipcRenderer.send("lock-source", JSON.stringify({
        sourceID
    }));
}
