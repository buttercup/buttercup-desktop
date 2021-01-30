import { ipcRenderer } from "electron";
import { VaultSourceID } from "buttercup";
import { getPrimaryPassword } from "./password";

export async function unlockVaultSource(sourceID: VaultSourceID) {
    const password = await getPrimaryPassword();
    if (!password) return;
    ipcRenderer.send("unlock-source", JSON.stringify({
        sourceID,
        password
    }));
}
