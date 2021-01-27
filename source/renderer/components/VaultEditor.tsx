import * as React from "react";
import { useState } from "@hookstate/core";
import { VaultProvider, VaultUI } from "@buttercup/ui";
import { CURRENT_FACADE, CURRENT_VAULT } from "../state/vaults";
import { fetchUpdatedFacade }from "../actions/facade";

const { useEffect } = React;

interface VaultEditorProps {
    sourceID: string;
}

function renderFacade(facade) {
    return (
        <VaultProvider
            vault={facade}
            // attachments
            // attachmentPreviews={attachmentPreviews}
            icons
            // onAddAttachments={async (entryID, files) => {
            //     const source = vaultManager.sources[0];
            //     const entry = source.vault.findEntryByID(entryID);
            //     for (const file of files) {
            //         const buff = await file.arrayBuffer();
            //         await source.attachmentManager.setAttachment(
            //         entry,
            //         AttachmentManager.newAttachmentID(),
            //         buff,
            //         file.name,
            //         file.type || 'application/octet-stream'
            //         );
            //     }
            //     setArchiveFacade(createVaultFacade(source.vault));
            // }}
            // onDeleteAttachment={deleteAttachment}
            // onDownloadAttachment={downloadAttachment}
            // onPreviewAttachment={previewAttachment}
            onUpdate={vaultFacade => {
                // console.log('Saving vault...');
                // const source = vaultManager.sources[0];
                // setArchiveFacade(processVaultUpdate(source.vault, vaultFacade));
            }}
        >
            <VaultUI />
        </VaultProvider>
    );
}

export function VaultEditor(props: VaultEditorProps) {
    const currentVaultState = useState(CURRENT_VAULT);
    const currentFacadeState = useState(CURRENT_FACADE);
    useEffect(() => {
        fetchUpdatedFacade(props.sourceID);
    }, [currentVaultState.get()]);
    const facade = currentFacadeState.get();
    return (
        <div>
            {facade && renderFacade(facade)}
        </div>
    );
}
