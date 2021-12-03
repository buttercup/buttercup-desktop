import { BrowserWindow } from "electron";
import {
    AttachmentDetails,
    AttachmentManager,
    Credentials,
    EntryID,
    TextDatasource,
    Vault,
    VaultFacade,
    VaultSource,
    VaultSourceID,
    VaultSourceStatus,
    VaultManager,
    consumeVaultFacade,
    createVaultFacade,
    init
} from "buttercup";
import { exportVaultToCSV } from "@buttercup/exporter";
import { describeSource } from "../library/sources";
import { clearFacadeCache } from "./facades";
import { notifyWindowsOfSourceUpdate } from "./windows";
import { getVaultCacheStorage, getVaultStorage } from "./storage";
import { updateSearchCaches } from "./search";
import { setAutoLockEnabled } from "./autoLock";
import { logErr } from "../library/log";
import { SourceType, VaultSourceDescription } from "../types";

const __watchedVaultSources: Array<VaultSourceID> = [];
let __vaultManager: VaultManager;

export async function addAttachment(
    sourceID: VaultSourceID,
    entryID: EntryID,
    filename: string,
    type: string,
    data: Buffer
) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    await source.attachmentManager.setAttachment(
        entry,
        AttachmentManager.newAttachmentID(),
        data,
        filename,
        type
    );
}

export async function addVault(
    name: string,
    sourceCredentials: Credentials,
    passCredentials: Credentials,
    type: SourceType,
    createNew: boolean = false
): Promise<VaultSourceID> {
    const credsSecure = await sourceCredentials.toSecureString();
    const vaultManager = getVaultManager();
    const source = new VaultSource(name, type, credsSecure);
    await vaultManager.interruptAutoUpdate(async () => {
        await vaultManager.addSource(source);
        await source.unlock(passCredentials, { initialiseRemote: createNew });
        await vaultManager.dehydrateSource(source);
    });
    return source.id;
}

export async function attachVaultManagerWatchers() {
    const vaultManager = getVaultManager();
    vaultManager.on("autoUpdateFailed", ({ source, error }) => {
        logErr(`Auto update failed for source: ${source.id}`, error);
    });
    vaultManager.on("sourcesUpdated", async () => {
        sendSourcesToWindows();
        vaultManager.unlockedSources.forEach((source) => {
            if (!__watchedVaultSources.includes(source.id)) {
                source.on("updated", () => onVaultSourceUpdated(source));
                __watchedVaultSources.push(source.id);
            }
        });
        await updateSearchCaches(vaultManager.unlockedSources);
    });
}

export async function deleteAttachment(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    await source.attachmentManager.removeAttachment(entry, attachmentID);
    await source.save();
}

export async function exportVault(sourceID: VaultSourceID): Promise<string> {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    const exported = await exportVaultToCSV(source.vault);
    return exported;
}

export async function getAttachmentData(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
): Promise<Buffer> {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    return source.attachmentManager.getAttachment(entry, attachmentID) as Promise<Buffer>;
}

export async function getAttachmentDetails(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
): Promise<AttachmentDetails> {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    const entry = source.vault.findEntryByID(entryID);
    return source.attachmentManager.getAttachmentDetails(entry, attachmentID);
}

export function getSourceDescription(sourceID: VaultSourceID): VaultSourceDescription {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    return source ? describeSource(source) : null;
}

export function getSourceDescriptions(): Array<VaultSourceDescription> {
    const vaultManager = getVaultManager();
    return vaultManager.sources.map((source) => describeSource(source));
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

export async function getEmptyVault(password: string): Promise<string> {
    const creds = Credentials.fromPassword(password);
    const vault = Vault.createWithDefaults();
    const tds = new TextDatasource(Credentials.fromPassword(password));
    return tds.save(vault.format.getHistory(), creds);
}

export function getSourceAttachmentsSupport(sourceID: VaultSourceID): boolean {
    const mgr = getVaultManager();
    const source = mgr.getSourceForID(sourceID);
    return source.supportsAttachments();
}

export function getSourceStatus(sourceID: VaultSourceID): VaultSourceStatus {
    const mgr = getVaultManager();
    const source = mgr.getSourceForID(sourceID);
    return (source && source.status) || null;
}

export function getUnlockedSourcesCount(): number {
    const mgr = getVaultManager();
    return mgr.unlockedSources.length;
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

export async function lockAllSources() {
    const vaultManager = getVaultManager();
    if (vaultManager.unlockedSources.length === 0) return;
    await Promise.all(vaultManager.unlockedSources.map((source) => source.lock()));
}

export async function lockSource(sourceID: VaultSourceID) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    if (source.status === VaultSourceStatus.Unlocked) {
        await source.lock();
    }
}

export async function mergeVaults(targetSourceID: VaultSourceID, incomingVault: Vault) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(targetSourceID);
    const incomingFacade = createVaultFacade(incomingVault);
    consumeVaultFacade(source.vault, incomingFacade, { mergeMode: true });
    await source.save();
}

export function onSourcesUpdated(callback: () => void): () => void {
    const vaultManager = getVaultManager();
    const innerCB = () => callback();
    vaultManager.on("sourcesUpdated", innerCB);
    return () => vaultManager.off("sourcesUpdated", innerCB);
}

function onVaultSourceUpdated(source: VaultSource) {
    clearFacadeCache(source.id);
    notifyWindowsOfSourceUpdate(source.id);
}

export async function removeSource(sourceID: VaultSourceID) {
    const vaultManager = getVaultManager();
    clearFacadeCache(sourceID);
    await vaultManager.removeSource(sourceID);
}

export async function saveSource(sourceID: VaultSourceID) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    await source.save();
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
    const sourceDescriptions = vaultManager.sources.map((source) => describeSource(source));
    for (const win of windows) {
        win.webContents.send("vaults-list", JSON.stringify(sourceDescriptions));
    }
}

export async function setSourceOrder(sourceID: VaultSourceID, newOrder: number) {
    const vaultManager = getVaultManager();
    await vaultManager.reorderSource(sourceID, newOrder);
    await vaultManager.dehydrate();
}

export async function testSourceMasterPassword(
    sourceID: VaultSourceID,
    password: string
): Promise<boolean> {
    const source = getVaultManager().getSourceForID(sourceID);
    return source.testMasterPassword(password);
}

export async function toggleAutoUpdate(autoUpdateEnabled: boolean = true) {
    setAutoLockEnabled(autoUpdateEnabled);
    const vaultManager = getVaultManager();
    await vaultManager.enqueueStateChange(() => {});
    vaultManager.toggleAutoUpdating(autoUpdateEnabled);
}

export async function unlockSource(sourceID: VaultSourceID, password: string) {
    const vaultManager = getVaultManager();
    const source = vaultManager.getSourceForID(sourceID);
    await source.unlock(Credentials.fromPassword(password));
}
