import { VaultSourceID } from "buttercup";
import { ipcRenderer } from "electron";

export async function setVaultSourceOrder(
    sourceID: VaultSourceID,
    newOrder: number
): Promise<void> {
    await ipcRenderer.invoke("set-source-order", sourceID, newOrder);
}
