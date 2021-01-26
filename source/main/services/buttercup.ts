import { BrowserWindow } from "electron";
import {
    Credentials,
    VaultSource,
    VaultManager,
    init
} from "buttercup";
import { describeSource } from "../library/sources";
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

function getVaultManager(): VaultManager {
    if (!__vaultManager) {
        init();
        __vaultManager = new VaultManager();
    }
    return __vaultManager;
}

export function sendSourcesToWindows() {
    const vaultManager = getVaultManager();
    const windows = BrowserWindow.getAllWindows();
    const sourceDescriptions = vaultManager.sources.map(source => describeSource(source));
    for (const win of windows) {
        console.log("SENDING", JSON.stringify(sourceDescriptions));
        win.webContents.send("vaults-list", JSON.stringify(sourceDescriptions));
    }
}
