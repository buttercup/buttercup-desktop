import path from "path";
import { BrowserWindow, dialog } from "electron";
import { Credentials } from "buttercup";
import { addVault } from "../services/buttercup";
import { AddVaultPayload, SourceType } from "../types";

export async function addVaultFromPayload(payload: AddVaultPayload) {
    let credentials: Credentials,
        name: string;
    switch (payload.type) {
        case SourceType.File: {
            credentials = Credentials.fromDatasource({
                path: payload.filename
            }, payload.masterPassword);
            name = path.basename(payload.filename).replace(/\.bcup$/i, "");
            break;
        }
        default:
            throw new Error(`Unsupported vault type: ${payload.type}`);
    }
    await addVault(name, credentials, Credentials.fromPassword(payload.masterPassword), payload.type, false);
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
