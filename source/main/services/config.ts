import { getConfigStorage } from "./storage";
import { naiveClone } from "../../shared/library/clone";
import { PREFERENCES_DEFAULT } from "../../shared/symbols";

const DEFAULT_CONFIG = {
    fileHostKey: null,
    preferences: naiveClone(PREFERENCES_DEFAULT),
    selectedSource: null,
    windowHeight: 600,
    windowWidth: 800
};

export async function getConfigValue<T>(key: string): Promise<T> {
    const storage = getConfigStorage();
    const value = await storage.getValue(key);
    return typeof value === "undefined" || value === null ? DEFAULT_CONFIG[key] || null : value;
}

export async function setConfigValue(
    key: string,
    value: object | string | number | boolean | null
): Promise<void> {
    const storage = getConfigStorage();
    await storage.setValue(key, value);
}
