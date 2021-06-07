import { ipcRenderer } from "electron";
import { EntryID, VaultSourceID } from "buttercup";
import { fetchUpdatedFacade } from "./facade";

export async function addAttachments(
    sourceID: VaultSourceID,
    entryID: EntryID,
    webFiles: Array<File>
) {
    for (const file of webFiles) {
        const buff = await file.arrayBuffer();
        const uint8Arr = new Uint8Array(buff);
        await ipcRenderer.invoke(
            "attachment-add",
            sourceID,
            entryID,
            file.name,
            file.type || "application/octet-stream",
            uint8Arr
        );
    }
    await ipcRenderer.invoke("save-source", sourceID);
    await fetchUpdatedFacade(sourceID);
}

export async function deleteAttachment(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
) {
    await ipcRenderer.invoke("attachment-delete", sourceID, entryID, attachmentID);
    await fetchUpdatedFacade(sourceID);
}

export async function downloadAttachment(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
): Promise<boolean> {
    const downloaded = await ipcRenderer.invoke(
        "attachment-download",
        sourceID,
        entryID,
        attachmentID
    );
    return downloaded;
}

export async function getAttachmentData(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
): Promise<Uint8Array> {
    const uint8Arr = await ipcRenderer.invoke(
        "attachment-get-data",
        sourceID,
        entryID,
        attachmentID
    );
    return uint8Arr;
}
