import path from "path";
import envPaths from "env-paths";
import { FileStorage } from "../library/FileStorage";

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
const VAULTS_CACHE_PATH = path.join(__envPaths.temp, "vaults-offline.cache.json");
const VAULTS_PATH = path.join(__envPaths.data, "vaults.json");

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
