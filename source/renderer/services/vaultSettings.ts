import { VaultSourceID } from "buttercup";
import { ipcRenderer } from "electron";
import { VaultSettingsLocal } from "../types";

export async function getVaultSettings(sourceID: VaultSourceID): Promise<VaultSettingsLocal> {
    const settings = await ipcRenderer.invoke("get-vault-settings", sourceID);
    return settings || null;
}

export async function saveVaultSettings(
    sourceID: VaultSourceID,
    settings: VaultSettingsLocal
): Promise<void> {
    await ipcRenderer.invoke("set-vault-settings", sourceID, settings);
}
