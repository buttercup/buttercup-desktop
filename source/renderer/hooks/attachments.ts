import { VaultSourceID } from "buttercup";
import { useCallback, useEffect, useState } from "react";
import { Layerr } from "layerr";
import {
    addAttachments as _addAttachments,
    deleteAttachment as _deleteAttachment,
    downloadAttachment as _downloadAttachment,
    getAttachmentData as _getAttachmentData
} from "../actions/attachment";
import { handleError } from "../actions/error";
import { showSuccess } from "../services/notifications";
import { arrayBufferToBase64 } from "../library/encoding";
import { t } from "../../shared/i18n/trans";

export function useAttachments(sourceID: VaultSourceID) {
    const [attachmentPreviews, setAttachmentPreviews] = useState({});
    const addAttachments = useCallback(
        async (entryID, files) => {
            try {
                await _addAttachments(sourceID, entryID, files);
            } catch (err) {
                handleError(new Layerr(err, "Failed adding attachments"));
            }
        },
        [sourceID]
    );
    const deleteAttachment = useCallback(
        async (entryID, attachmentID) => {
            try {
                await _deleteAttachment(sourceID, entryID, attachmentID);
            } catch (err) {
                handleError(new Layerr(err, "Failed deleting attachment"));
            }
        },
        [attachmentPreviews, sourceID]
    );
    const downloadAttachment = useCallback(
        async (entryID, attachmentID) => {
            try {
                await _downloadAttachment(sourceID, entryID, attachmentID);
                showSuccess(t("notification.attachment-downloaded"));
            } catch (err) {
                handleError(new Layerr(err, "Failed downloading attachment"));
            }
        },
        [sourceID]
    );
    const previewAttachment = useCallback(
        async (entryID, attachmentID) => {
            if (attachmentPreviews[attachmentID]) return;
            try {
                const data: Uint8Array = await _getAttachmentData(sourceID, entryID, attachmentID);
                setAttachmentPreviews({
                    ...attachmentPreviews,
                    [attachmentID]: arrayBufferToBase64(data)
                });
            } catch (err) {
                handleError(new Layerr(err, "Failed deleting attachment"));
            }
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
