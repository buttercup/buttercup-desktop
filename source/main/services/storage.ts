import path from "path";
import envPaths from "env-paths";
import { FileStorage } from "../library/FileStorage";
import { VaultSourceID } from "buttercup";

interface EnvPaths {
    data: string;
    config: string;
    cache: string;
    log: string;
    temp: string;
}

let __envPaths: EnvPaths;
if ("BUTTERCUP_HOME_DIR" in process.env) {
    __envPaths = {
        data: path.join(process.env.BUTTERCUP_HOME_DIR, "data"),
        config: path.join(
            process.env.BUTTERCUP_CONFIG_DIR || process.env.BUTTERCUP_HOME_DIR,
            "config"
        ),
        cache: path.join(process.env.BUTTERCUP_HOME_DIR, "cache"),
        log: path.join(process.env.BUTTERCUP_HOME_DIR, "log"),
        temp: path.join(process.env.BUTTERCUP_TEMP_DIR || process.env.BUTTERCUP_HOME_DIR, "temp")
    };
} else {
    const TEMP_ENV_PATHS = envPaths("Buttercup");
    __envPaths = {
        data: TEMP_ENV_PATHS.data,
        config: TEMP_ENV_PATHS.config,
        cache: TEMP_ENV_PATHS.cache,
        log: TEMP_ENV_PATHS.log,
        temp: TEMP_ENV_PATHS.temp
    };
}

const CONFIG_PATH = path.join(__envPaths.config, "desktop.config.json");
export const LOG_FILENAME = "buttercup-desktop.log";
export const LOG_PATH = path.join(__envPaths.log, LOG_FILENAME);
export const VAULTS_BACKUP_PATH = path.join(__envPaths.data, "backup");
const VAULTS_CACHE_PATH = path.join(__envPaths.temp, "vaults-offline.cache.json");
const VAULTS_PATH = path.join(__envPaths.data, "vaults.json");
const VAULT_SETTINGS_PATH = path.join(__envPaths.config, "vault-config-SOURCEID.json");

let __configStorage: FileStorage = null,
    __vaultStorage: FileStorage = null,
    __vaultCacheStorage: FileStorage = null;

export function getConfigPath(): string {
    return CONFIG_PATH;
}

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

export function getVaultSettingsPath(sourceID: VaultSourceID): string {
    return VAULT_SETTINGS_PATH.replace("SOURCEID", sourceID);
}

export function getVaultSettingsStorage(sourceID: VaultSourceID): FileStorage {
    return new FileStorage(getVaultSettingsPath(sourceID));
}

export function getVaultStorage(): FileStorage {
    if (!__vaultStorage) {
        __vaultStorage = new FileStorage(VAULTS_PATH);
    }
    return __vaultStorage;
}

export function getVaultStoragePath(): string {
    return VAULTS_PATH;
}
