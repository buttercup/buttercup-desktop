import path from "path";
import fs from "fs/promises";
import { VaultSource, VaultSourceID } from "buttercup";
import { logErr, logInfo } from "../library/log";
import { getVaultSettings } from "./config";
import { VAULTS_BACKUP_PATH } from "./storage";

const __removeListener: Record<VaultSourceID, () => void> = {};

export function attachSourceEncryptedListeners(source: VaultSource) {
    if (__removeListener[source.id]) {
        __removeListener[source.id]();
        delete __removeListener[source.id];
    }
    const handler = ({ content }) => {
        handleSourceSave(source.id, content).catch((err) => {
            logErr(`Failed processing backup for source: ${source.id}`, err);
            delete __removeListener[source.id];
        });
    };
    source._datasource.on("encryptedContent", handler);
    __removeListener[source.id] = () => source._datasource.off("encryptedContent", handler);
}

function getBackupFilename(sourceID: VaultSourceID, type: "save"): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${type}_${year}-${month}-${day}_${hour}-${minute}-${second}_${date.getTime()}.bcup`;
}

async function handleSourceSave(sourceID: VaultSourceID, content: string): Promise<void> {
    // Get settings for source
    const vaultSettings = await getVaultSettings(sourceID);
    if (!vaultSettings.localBackup) return;
    // Calculate pat
    const backupRoot =
        typeof vaultSettings.localBackupLocation === "string" && vaultSettings.localBackupLocation
            ? path.resolve(
                  VAULTS_BACKUP_PATH,
                  path.join(vaultSettings.localBackupLocation, sourceID)
              )
            : path.join(VAULTS_BACKUP_PATH, sourceID);
    const backupPath = path.join(backupRoot, getBackupFilename(sourceID, "save"));
    // Create folders
    await fs.mkdir(backupRoot, {
        recursive: true
    });
    // Backup
    logInfo(`Backing up source: ${sourceID} => ${backupPath}`);
    await fs.writeFile(backupPath, content);
    logInfo(`Source backup complete: ${sourceID}`);
}
