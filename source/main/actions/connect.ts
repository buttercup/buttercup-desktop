import { BrowserWindow, dialog } from "electron";

export async function showAddFileVaultDialog(win: BrowserWindow) {
    const result = await dialog.showOpenDialog(win, {
        title: "Add Existing Vault",
        buttonLabel: "Add",
        filters: [
            { name: "Buttercup Vaults", extensions: ["bcup"] }
        ],
        properties: ["openFile"]
    });
    const [vaultPath] = result.filePaths;
}
