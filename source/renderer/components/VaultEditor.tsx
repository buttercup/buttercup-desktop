import * as React from "react";
import { useState } from "@hookstate/core";
import { VaultProvider, VaultUI, themes } from "@buttercup/ui";
import { VaultSourceStatus } from "buttercup";
import { ThemeProvider } from "styled-components";
import { CURRENT_FACADE, CURRENT_VAULT, VAULTS_LIST } from "../state/vaults";
import { fetchUpdatedFacade }from "../actions/facade";

import "@buttercup/ui/dist/styles.css";

const { useEffect, useMemo } = React;

interface VaultEditorProps {
    sourceID: string;
}

function renderFacade(facade) {
    return (
        <ThemeProvider theme={true ? themes.dark : themes.light}>
            <VaultProvider
                vault={facade}
                // attachments
                // attachmentPreviews={attachmentPreviews}
                icons
                iconsPath="icons"
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
        </ThemeProvider>
    );
}

export function VaultEditor(props: VaultEditorProps) {
    const currentVaultState = useState(CURRENT_VAULT);
    const currentFacadeState = useState(CURRENT_FACADE);
    const vaultListState = useState(VAULTS_LIST);
    const vaultItem = useMemo(() => {
        const vaultList = vaultListState.get();
        return vaultList.find(item => item.id === props.sourceID) || null;
    }, [vaultListState.get()]);
    useEffect(() => {
        if (vaultItem && vaultItem.state === VaultSourceStatus.Unlocked) {
            fetchUpdatedFacade(vaultItem.id);
        }
    }, [currentVaultState.get(), vaultItem]);
    const facade = currentFacadeState.get();
    // Optional rendering
    if (!vaultItem) return null;
    if (vaultItem.state !== VaultSourceStatus.Unlocked) {
        return <span>Not unlocked</span>;
    }
    // Normal output
    return (
        <>
            {facade && renderFacade(facade)}
        </>
    );
}
