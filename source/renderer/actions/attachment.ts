import { ipcRenderer } from "electron";
import { EntryID, VaultSourceID } from "buttercup";
import { fetchUpdatedFacade } from "./facade";

export async function deleteAttachment(
    sourceID: VaultSourceID,
    entryID: EntryID,
    attachmentID: string
) {
    await ipcRenderer.invoke("attachment-delete", sourceID, entryID, attachmentID);
    await fetchUpdatedFacade(sourceID);
}
