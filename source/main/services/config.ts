import fs from "fs/promises";
import { VaultSourceID } from "buttercup";
import { getConfigStorage, getVaultSettingsPath, getVaultSettingsStorage } from "./storage";
import { naiveClone } from "../../shared/library/clone";
import { PREFERENCES_DEFAULT, VAULT_SETTINGS_DEFAULT } from "../../shared/symbols";
import { VaultSettingsLocal } from "../types";
import { logErr } from "../library/log";

const DEFAULT_CONFIG = {
    fileHostKey: null,
    preferences: naiveClone(PREFERENCES_DEFAULT),
    selectedSource: null,
    windowHeight: 600,
    windowWidth: 800,
    windowX: null,
    windowY: null
};

export async function getConfigValue<T>(key: string): Promise<T> {
    const storage = getConfigStorage();
    const value = await storage.getValue(key);
    return typeof value === "undefined" || value === null ? DEFAULT_CONFIG[key] || null : value;
}

export async function getVaultSettings(sourceID: VaultSourceID): Promise<VaultSettingsLocal> {
    const storage = getVaultSettingsStorage(sourceID);
    const keys = await storage.getAllKeys();
    if (keys.length === 0) return naiveClone(VAULT_SETTINGS_DEFAULT);
    const settings = await storage.getValues(keys);
    return settings as unknown as VaultSettingsLocal;
}

export async function removeVaultSettings(sourceID: VaultSourceID): Promise<void> {
    const path = getVaultSettingsPath(sourceID);
    try {
        await fs.unlink(path);
    } catch (err) {
        logErr(`Failed removing vault settings: ${sourceID}`, err);
    }
}

export async function setConfigValue(
    key: string,
    value: object | string | number | boolean | null
): Promise<void> {
    const storage = getConfigStorage();
    await storage.setValue(key, value);
}

export async function setVaultSettings(
    sourceID: VaultSourceID,
    settings: VaultSettingsLocal
): Promise<void> {
    const storage = getVaultSettingsStorage(sourceID);
    await storage.setValues(settings);
}
