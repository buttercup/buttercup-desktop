import path from "path";
import envPaths from "env-paths";
import { FileStorage } from "../library/FileStorage";

if ("BUTTERCUP_HOME_DIR" in process.env) {
    var ENV_PATHS = {
		data: path.join(process.env.BUTTERCUP_HOME_DIR, "data"),
		config: path.join(process.env.BUTTERCUP_CONFIG_DIR || process.env.BUTTERCUP_HOME_DIR, "config"),
		cache: path.join(process.env.BUTTERCUP_HOME_DIR, "cache"),
		log: path.join(process.env.BUTTERCUP_HOME_DIR, "log"),
		temp: path.join(process.env.BUTTERCUP_TEMP_DIR || process.env.BUTTERCUP_HOME_DIR, "temp")
	};
}
else { 
    const TEMP_ENV_PATHS = envPaths("Buttercup");
    var ENV_PATHS = {
		data: TEMP_ENV_PATHS.log,
		config: TEMP_ENV_PATHS.config,
		cache: TEMP_ENV_PATHS.log,
		log: TEMP_ENV_PATHS.log,
		temp: TEMP_ENV_PATHS.log
	}
}
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
