import { VaultSourceID } from "buttercup";
import { useCallback, useEffect, useState } from "react";
import { deleteAttachment as _deleteAttachment } from "../actions/attachment";
import { handleError } from "../actions/error";

export function useAttachments(sourceID: VaultSourceID) {
    const [attachmentPreviews, setAttachmentPreviews] = useState({});
    const addAttachments = useCallback(
        async (entryID, files) => {
            // const source = vaultManager.sources[0];
            // const entry = source.vault.findEntryByID(entryID);
            // for (const file of files) {
            //   const buff = await file.arrayBuffer();
            //   await source.attachmentManager.setAttachment(
            //     entry,
            //     AttachmentManager.newAttachmentID(),
            //     buff,
            //     file.name,
            //     file.type || 'application/octet-stream'
            //   );
            // }
            // setArchiveFacade(createVaultFacade(source.vault));
        },
        [sourceID]
    );
    const deleteAttachment = useCallback(
        async (entryID, attachmentID) => {
            try {
                await _deleteAttachment(sourceID, entryID, attachmentID);
            } catch (err) {
                handleError(err);
            }
        },
        [attachmentPreviews, sourceID]
    );
    const downloadAttachment = useCallback(
        async (entryID, attachmentID) => {
            // const source = vaultManager.sources[0];
            // const entry = source.vault.findEntryByID(entryID);
            // const attachmentDetails = await source.attachmentManager.getAttachmentDetails(
            //     entry,
            //     attachmentID
            // );
            // const attachmentData = await source.attachmentManager.getAttachment(entry, attachmentID);
            // // Download
            // const blob = new Blob([attachmentData], { type: attachmentDetails.type });
            // const objectUrl = URL.createObjectURL(blob);
            // const anchor = document.createElement('a');
            // anchor.href = objectUrl;
            // anchor.download = attachmentDetails.name;
            // document.body.appendChild(anchor);
            // anchor.click();
            // setTimeout(() => {
            //     URL.revokeObjectURL(objectUrl);
            //     document.body.removeChild(anchor);
            // }, 0);
        },
        [sourceID]
    );
    const previewAttachment = useCallback(
        async (entryID, attachmentID) => {
            if (attachmentPreviews[attachmentID]) return;
            // const source = vaultManager.sources[0];
            // const entry = source.vault.findEntryByID(entryID);
            // const attachmentData = await source.attachmentManager.getAttachment(entry, attachmentID);
            // setAttachmentPreviews({
            //     ...attachmentPreviews,
            //     [attachmentID]: arrayBufferToBase64(attachmentData)
            // });
        },
        [attachmentPreviews, sourceID]
    );
    useEffect(() => {
        setAttachmentPreviews({});
    }, [sourceID]);
    return {
        addAttachments,
        attachmentPreviews,
        deleteAttachment,
        downloadAttachment,
        previewAttachment
    };
}
