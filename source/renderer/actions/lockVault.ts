import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { getPrimaryPassword } from "./password";

export async function lockVaultSource(sourceID: VaultSourceID) {
    ipcRenderer.send("lock-source", JSON.stringify({
        sourceID
    }));
}
