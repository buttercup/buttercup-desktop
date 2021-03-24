import path from "path";
import envPaths from "env-paths";
import { FileStorage } from "../library/FileStorage";

const ENV_PATHS = envPaths("Buttercup");
const CONFIG_PATH = path.join(ENV_PATHS.config, "desktop.config.json");
export const LOG_FILENAME = "buttercup-desktop.log";
export const LOG_PATH = path.join(ENV_PATHS.log, LOG_FILENAME);
const VAULTS_CACHE_PATH = path.join(ENV_PATHS.temp, "vaults-offline.cache.json");
const VAULTS_PATH = path.join(ENV_PATHS.data, "vaults.json");

let __configStorage: FileStorage = null,
    __vaultStorage: FileStorage = null,
    __vaultCacheStorage: FileStorage = null;

export function getConfigStorage(): FileStorage {
    if (!__configStorage) {
        __configStorage = new FileStorage(CONFIG_PATH);
    }
    return __configStorage;
}

export function getVaultCacheStorage(): FileStorage {
    if (!__vaultCacheStorage) {
        __vaultCacheStorage = new FileStorage(VAULTS_CACHE_PATH);
    }
    return __vaultCacheStorage;
}

export function getVaultStorage(): FileStorage {
    if (!__vaultStorage) {
        __vaultStorage = new FileStorage(VAULTS_PATH);
    }
    return __vaultStorage;
}
