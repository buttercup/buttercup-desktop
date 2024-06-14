import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useState as useHookState } from "@hookstate/core";
import { useSingleState } from "react-obstate";
import { Intent, NonIdealState, Tag } from "@blueprintjs/core";
import { themes } from "@buttercup/ui";
import { VaultFacade, VaultSourceStatus } from "buttercup";
import styled, { ThemeProvider } from "styled-components";
import { SearchContext } from "./search/SearchContext";
import { VaultProvider } from "./vault/VaultContext";
import { VaultUI } from "./vault/VaultUI";
import { VAULTS_STATE } from "../state/vaults";
import { SAVING } from "../state/app";
import { fetchUpdatedFacade } from "../actions/facade";
import { saveVaultFacade } from "../actions/saveVault";
import { toggleAutoUpdate } from "../actions/autoUpdate";
import { userCopiedText } from "../actions/clipboard";
import { setSelectedSource } from "../services/config";
import { useCurrentFacade } from "../hooks/facade";
import { useTheme } from "../hooks/theme";
import { useAttachments } from "../hooks/attachments";
import { logErr, logInfo } from "../library/log";
import { getThemeProp } from "../styles/theme";
import { t } from "../../shared/i18n/trans";
import { ATTACHMENTS_MAX_SIZE } from "../../shared/symbols";
import { Theme } from "../types";

// import "@buttercup/ui/dist/styles.css";

const BENCH_IMAGE = require("../../../resources/images/bench.png").default;

interface VaultEditorProps {
    onUnlockRequest: () => void;
    sourceID: string;
}

const LockedImage = styled.img`
    max-height: 308px;
    width: auto;
    user-select: none;
`;
const LockedNonIdealState = styled(NonIdealState)`
    background-color: ${props => getThemeProp(props, "base.contentBgColor")};

    > .bp3-non-ideal-state-visual {
        margin-bottom: 0;
    }
`;

export function VaultEditor(props: VaultEditorProps) {
    const { onUnlockRequest, sourceID } = props;
    const history = useHistory();
    const currentFacade = useCurrentFacade();
    const [currentSupportsAttachments] = useSingleState(VAULTS_STATE, "currentVaultAttachments");
    const [vaultList] = useSingleState(VAULTS_STATE, "vaultsList");
    const savingState = useHookState(SAVING);
    const {
        addAttachments,
        attachmentPreviews,
        deleteAttachment,
        downloadAttachment,
        previewAttachment
    } = useAttachments(sourceID);
    const vaultItem = useMemo(() => {
        return vaultList.find(item => item.id === sourceID) || null;
    }, [sourceID, vaultList]);
    const themeType = useTheme();
    const [currentlyEditing, setCurrentlyEditing] = useState(false);
    useEffect(() => {
        if (vaultItem && vaultItem.state === VaultSourceStatus.Unlocked) {
            fetchUpdatedFacade(vaultItem.id);
        }
    }, [sourceID, vaultItem?.state]);
    useEffect(() => {
        logInfo(`Toggling auto-update for vault editing (editing=${currentlyEditing}, auto-update=${!currentlyEditing})`);
        toggleAutoUpdate(!currentlyEditing).catch(err => {
            logErr("Failed toggling auto-update", err);
        });
    }, [currentlyEditing]);
    useEffect(() => {
        setSelectedSource(sourceID);
    }, [sourceID]);
    // Search
    const {
        resetSelection,
        selectedEntryID,
        selectedGroupID,
        setSelectedEntryID,
        setSelectedGroupID
    } = useContext(SearchContext);
    useEffect(() => {
        return () => {
            // Reset search on unmount
            resetSelection();
        };
    }, []);
    useEffect(() => {
        if (vaultItem) return;
        const resetTimer = setTimeout(() => {
            history.push("/");
        }, 50);
        return () => {
            clearTimeout(resetTimer);
        };
    }, [vaultItem]);
    // Optional rendering
    if (!vaultItem) return null;
    if (vaultItem.state !== VaultSourceStatus.Unlocked) {
        return (
            <LockedNonIdealState
                icon={
                    <LockedImage src={BENCH_IMAGE} />
                }
                title={t("vault-editor.locked-state")}
                action={
                    <Tag
                        icon="unlock"
                        interactive
                        intent={Intent.PRIMARY}
                        large
                        onClick={() => onUnlockRequest()}
                        round
                    >
                        {vaultItem.name}
                    </Tag>
                }
            />
        );
    }
    // Normal output
    return (
        <>
            {currentFacade && (
                <ThemeProvider theme={themeType === Theme.Dark ? themes.dark : themes.light}>
                    <VaultProvider
                        attachments={currentSupportsAttachments}
                        attachmentsMaxSize={ATTACHMENTS_MAX_SIZE}
                        attachmentPreviews={attachmentPreviews}
                        icons
                        onAddAttachments={addAttachments}
                        onDeleteAttachment={deleteAttachment}
                        onDownloadAttachment={downloadAttachment}
                        onEditing={setCurrentlyEditing}
                        onPreviewAttachment={previewAttachment}
                        onSelectEntry={setSelectedEntryID}
                        onSelectGroup={setSelectedGroupID}
                        onUserCopy={userCopiedText}
                        onUpdate={(vaultFacade: VaultFacade) => {
                            saveVaultFacade(vaultItem.id, vaultFacade);
                        }}
                        readOnly={savingState.get()}
                        selectedEntry={selectedEntryID}
                        selectedGroup={selectedGroupID}
                        vault={currentFacade}
                    >
                        <VaultUI />
                    </VaultProvider>
                </ThemeProvider>
            )}
        </>
    );
}
