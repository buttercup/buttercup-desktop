import path from "path";
import { BrowserWindow, dialog } from "electron";
import { Credentials, VaultSourceID } from "buttercup";
import { addVault } from "../services/buttercup";
import { logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { AddVaultPayload, SourceType } from "../types";

export async function addVaultFromPayload(payload: AddVaultPayload): Promise<VaultSourceID> {
    let credentials: Credentials, name: string;
    switch (payload.datasourceConfig.type) {
        case SourceType.GoogleDrive:
            credentials = Credentials.fromDatasource(
                payload.datasourceConfig,
                payload.masterPassword
            );
            name = payload.fileNameOverride || payload.datasourceConfig.fileID;
            break;
        case SourceType.Dropbox:
        /* falls-through */
        case SourceType.WebDAV:
        /* falls-through */
        case SourceType.File: {
            credentials = Credentials.fromDatasource(
                payload.datasourceConfig,
                payload.masterPassword
            );
            name = path.basename(payload.datasourceConfig.path).replace(/\.bcup$/i, "");
            break;
        }
        default:
            throw new Error(`Unsupported vault type: ${payload.datasourceConfig.type}`);
    }
    logInfo(
        `Adding vault "${name}" (${payload.datasourceConfig.type}) (new = ${
            payload.createNew ? "yes" : "no"
        })`
    );
    const sourceID = await addVault(
        name,
        credentials,
        Credentials.fromPassword(payload.masterPassword),
        payload.datasourceConfig.type,
        payload.createNew
    );
    logInfo(`Added vault "${name}" (${sourceID})`);
    return sourceID;
}

export async function showExistingFileVaultDialog(win: BrowserWindow): Promise<string> {
    const result = await dialog.showOpenDialog(win, {
        title: t("dialog.file-vault.add-existing.title"),
        buttonLabel: t("dialog.file-vault.add-existing.confirm-button"),
        filters: [{ name: t("dialog.file-vault.add-existing.bcup-filter"), extensions: ["bcup"] }],
        properties: ["openFile"]
    });
    const [vaultPath] = result.filePaths;
    return vaultPath || null;
}

export async function showNewFileVaultDialog(win: BrowserWindow): Promise<string> {
    const result = await dialog.showSaveDialog(win, {
        title: t("dialog.file-vault.add-new.title"),
        buttonLabel: t("dialog.file-vault.add-new.confirm-button"),
        filters: [{ name: t("dialog.file-vault.add-new.bcup-filter"), extensions: ["bcup"] }],
        properties: ["createDirectory", "dontAddToRecent", "showOverwriteConfirmation"]
    });
    let vaultPath = result.filePath;
    if (!vaultPath) return null;
    if (/\.bcup$/i.test(vaultPath) === false) {
        vaultPath = `${vaultPath}.bcup`;
    }
    return vaultPath;
}
