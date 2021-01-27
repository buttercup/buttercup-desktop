import { BrowserWindow } from "electron";
import {
    Credentials,
    VaultFacade,
    VaultSource,
    VaultSourceID,
    VaultSourceStatus,
    VaultManager,
    createVaultFacade,
    init
} from "buttercup";
import { describeSource } from "../library/sources";
import { clearFacadeCache } from "./facades";
import { notifyWindowsOfSourceUpdate } from "./windows";
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
        // dispatch(setArchives(vaultManager.sources.map(source => describeSource(source))));
        // dispatch(setArchivesCount(vaultManager.sources.length));
        // dispatch(setUnlockedArchivesCount(vaultManager.unlockedSources.length));
        // updateFacades()
        //     .then(() => {
        //         __updateSearch();
        //     })
        //     .catch(err => {
        //         log.error("Failed updating facades after sources updated");
        //         console.error(err);
        //     });
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
        __vaultManager = new VaultManager();
    }
    return __vaultManager;
}

function onVaultSourceUpdated(source: VaultSource) {
    clearFacadeCache(source.id);
    notifyWindowsOfSourceUpdate(source.id);
}

export function sendSourcesToWindows() {
    const vaultManager = getVaultManager();
    const windows = BrowserWindow.getAllWindows();
    const sourceDescriptions = vaultManager.sources.map(source => describeSource(source));
    for (const win of windows) {
        win.webContents.send("vaults-list", JSON.stringify(sourceDescriptions));
    }
}
