import { getConfigStorage } from "./storage";

const DEFAULT_CONFIG = {
    windowHeight: 600,
    windowWidth: 800
};

export async function getConfigValue<T>(key: string): Promise<T> {
    const storage = getConfigStorage();
    const value = await storage.getValue(key);
    return typeof value === "undefined" || value === null ? DEFAULT_CONFIG[key] || null : JSON.parse(value);
}

export async function setConfigValue(key: string, value: string | number | boolean | null): Promise<void> {
    const storage = getConfigStorage();
    await storage.setValue(key, JSON.stringify(value));
}
