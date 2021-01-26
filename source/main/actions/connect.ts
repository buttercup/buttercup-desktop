import { BrowserWindow, dialog } from "electron";

export async function runAddFileVault(win: BrowserWindow) {
    const filename = await showAddFileVaultDialog(win);
    console.log("FILE:", filename);
}

async function showAddFileVaultDialog(win: BrowserWindow): Promise<string> {
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
