import { BrowserWindow } from "electron";
import {
    Credentials,
    VaultFacade,
    VaultSource,
    VaultSourceID,
    VaultSourceStatus,
    VaultManager,
    consumeVaultFacade,
    createVaultFacade,
    init
} from "buttercup";
import { describeSource } from "../library/sources";
import { clearFacadeCache } from "./facades";
import { notifyWindowsOfSourceUpdate } from "./windows";
import {
    getVaultCacheStorage,
    getVaultStorage
} from "./storage";
import { SourceType } from "../types";

let __vaultManager: VaultManager;

export async function addVault(name: string, sourceCredentials: Credentials, passCredentials: Credentials, type: SourceType, createNew: boolean = false) {
    const credsSecure = await sourceCredentials.toSecureString();
    const vaultManager = getVaultManager();
    const source = new VaultSource(name, type, credsSecure);
    await vaultManager.interruptAutoUpdate(async () => {
        await vaultManager.addSource(source);
        await source.unlock(passCredentials, { initialiseRemote: createNew });
        await vaultManager.dehydrateSource(source);
    });
}

export async function attachVaultManagerWatchers() {
    const vaultManager = getVaultManager();
    vaultManager.on("sourcesUpdated", () => {
        sendSourcesToWindows();
        vaultManager.unlockedSources.forEach(source => {
            source.removeListener("updated");
            source.on("updated", () => onVaultSourceUpdated(source));
        });
    });
}

export function getVaultFacadeBySource(sourceID: VaultSourceID): VaultFacade {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    if (!source) {
        throw new Error(`Cannot generate facade: No source found for ID: ${sourceID}`);
    } else if (source.status !== VaultSourceStatus.Unlocked) {
        throw new Error(`Cannot generate facade: Source is not unlocked: ${sourceID}`);
    }
    return createVaultFacade(source.vault);
}

function getVaultManager(): VaultManager {
    if (!__vaultManager) {
        init();
        __vaultManager = new VaultManager({
            cacheStorage: getVaultCacheStorage(),
            sourceStorage: getVaultStorage()
        });
    }
    return __vaultManager;
}

export async function loadVaultsFromDisk() {
    await getVaultManager().rehydrate();
}

function onVaultSourceUpdated(source: VaultSource) {
    clearFacadeCache(source.id);
    notifyWindowsOfSourceUpdate(source.id);
}

export async function saveVaultFacade(sourceID: VaultSourceID, facade: VaultFacade): Promise<void> {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    consumeVaultFacade(source.vault, facade);
    await source.save();
}

export function sendSourcesToWindows() {
    const vaultManager = getVaultManager();
    const windows = BrowserWindow.getAllWindows();
    const sourceDescriptions = vaultManager.sources.map(source => describeSource(source));
    for (const win of windows) {
        win.webContents.send("vaults-list", JSON.stringify(sourceDescriptions));
    }
}

export async function unlockSource(sourceID: VaultSourceID, password: string) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    await source.unlock(Credentials.fromPassword(password));
}
