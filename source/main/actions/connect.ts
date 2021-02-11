import path from "path";
import { BrowserWindow, dialog } from "electron";
import { Credentials } from "buttercup";
import { addVault } from "../services/buttercup";
import { AddVaultPayload, SourceType } from "../types";

export async function addVaultFromPayload(payload: AddVaultPayload) {
    let credentials: Credentials,
        name: string;
    switch (payload.datasourceConfig.type) {
        case SourceType.Dropbox:
        /* falls-through */
        case SourceType.WebDAV:
        /* falls-through */
        case SourceType.File: {
            credentials = Credentials.fromDatasource(payload.datasourceConfig, payload.masterPassword);
            name = path.basename(payload.datasourceConfig.path).replace(/\.bcup$/i, "");
            break;
        }
        default:
            throw new Error(`Unsupported vault type: ${payload.datasourceConfig.type}`);
    }
    await addVault(name, credentials, Credentials.fromPassword(payload.masterPassword), payload.datasourceConfig.type, payload.createNew);
}

export async function showAddFileVaultDialog(win: BrowserWindow): Promise<string> {
    const result = await dialog.showOpenDialog(win, {
        title: "Add Existing Vault",
        buttonLabel: "Add",
        filters: [
            { name: "Buttercup Vaults", extensions: ["bcup"] }
        ],
        properties: ["openFile"]
    });
    const [vaultPath] = result.filePaths;
    return vaultPath || null;
}
