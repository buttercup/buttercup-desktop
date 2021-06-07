import fs from "fs";
import { EntryID, VaultSourceID } from "buttercup";
import { dialog } from "electron";
import pify from "pify";
import { getAttachmentData, getAttachmentDetails } from "../services/buttercup";
import { getMainWindow } from "../services/windows";
import { t } from "../../shared/i18n/trans";

const writeFile = pify(fs.writeFile);

export async function startAttachmentDownload(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
): Promise<boolean> {
    const win = getMainWindow();
    const attachmentDetails = await getAttachmentDetails(sourceID, entryID, attachmentID);
    const result = await dialog.showSaveDialog(win, {
        title: t("dialog.attachment-save.title"),
        buttonLabel: t("dialog.attachment-save.confirm-button"),
        defaultPath: attachmentDetails.name,
        properties: ["createDirectory", "dontAddToRecent", "showOverwriteConfirmation"]
    });
    if (result.canceled) return false;
    const data = await getAttachmentData(sourceID, entryID, attachmentID);
    await writeFile(result.filePath, data);
    return true;
}
