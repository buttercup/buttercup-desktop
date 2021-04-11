import path from "path";
import { dialog } from "electron";
import { Vault, VaultSourceID } from "buttercup";
import {
    BitwardenImporter,
    ButtercupCSVImporter,
    ButtercupImporter,
    CSVImporter,
    KeePass2XMLImporter,
    LastPassImporter,
    OnePasswordImporter
} from "@buttercup/importer";
import { mergeVaults } from "./buttercup";
import { getMainWindow } from "./windows";
import { t } from "../../shared/i18n/trans";
import { logErr } from "../library/log";

export interface Importer {
    export: () => Promise<Vault>;
}

export interface ImporterConstructor {
    loadFromFile: (filename: string, password?: string) => Promise<Importer>;
}

export const IMPORTERS = [
    ["Bitwarden", "json", BitwardenImporter],
    // ["Buttercup", "bcup", ButtercupImporter], // @todo
    ["Buttercup", "csv", ButtercupCSVImporter],
    ["CSV", "csv", CSVImporter],
    ["KeePass", "xml", KeePass2XMLImporter],
    ["Lastpass", "csv", LastPassImporter],
    ["1Password", "1pif", OnePasswordImporter]
];
const IMPORTERS_WITH_PASSWORDS = [ButtercupImporter];

export async function startImport(
    sourceID: VaultSourceID,
    name: string,
    extension: string,
    Importer: ImporterConstructor
): Promise<void> {
    const mainWindow = getMainWindow();
    const result = await dialog.showOpenDialog(mainWindow, {
        title: t("dialog.import-file-chooser.title", { importer: name }),
        buttonLabel: t("dialog.import-file-chooser.submit-button"),
        filters: [
            {
                name,
                extensions: [extension]
            }
        ],
        properties: ["openFile"]
    });
    const [vaultPath] = result.filePaths;
    if (!vaultPath) return null;
    mainWindow.webContents.send("set-busy", true);
    try {
        // Create importer
        const importerInst = await Importer.loadFromFile(vaultPath);
        const importedVault = await importerInst.export();
        // Import into source's vault
        await mergeVaults(sourceID, importedVault);
        // Notify
        mainWindow.webContents.send(
            "notify-success",
            t("notification.import-success", { filename: path.basename(vaultPath) })
        );
    } catch (err) {
        logErr("Failed importing", err);
        mainWindow.webContents.send(
            "notify-error",
            t("notification.error.import-failed", { error: err.message })
        );
    } finally {
        mainWindow.webContents.send("set-busy", false);
    }
}
