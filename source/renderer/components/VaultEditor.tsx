import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useState as useHookState } from "@hookstate/core";
import { VaultProvider, VaultUI, themes } from "@buttercup/ui";
import { VaultFacade, VaultSourceStatus } from "buttercup";
import { ThemeProvider } from "styled-components";
import { SearchContext } from "./search/SearchContext";
import { VAULTS_LIST } from "../state/vaults";
import { SAVING } from "../state/app";
import { fetchUpdatedFacade } from "../actions/facade";
import { saveVaultFacade } from "../actions/saveVault";
import { useCurrentFacade } from "../hooks/facade";
import { useTheme } from "../hooks/theme";
import { Theme } from "../types";

import "@buttercup/ui/dist/styles.css";

interface VaultEditorProps {
    sourceID: string;
}

function renderFacade(
    facade: VaultFacade,
    onUpdate: (facade: VaultFacade) => void,
    theme: Theme,
    isSaving: boolean = false
) {
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
    return (
        <ThemeProvider theme={theme === Theme.Dark ? themes.dark : themes.light}>
            <VaultProvider
                icons
                iconsPath="icons"
                onSelectEntry={setSelectedEntryID}
                onSelectGroup={setSelectedGroupID}
                onUpdate={(vaultFacade: VaultFacade) => {
                    onUpdate(vaultFacade);
                }}
                readOnly={isSaving}
                selectedEntry={selectedEntryID}
                selectedGroup={selectedGroupID}
                vault={facade}
            >
                <VaultUI />
            </VaultProvider>
        </ThemeProvider>
    );
}

export function VaultEditor(props: VaultEditorProps) {
    const currentFacade = useCurrentFacade();
    const vaultListState = useHookState(VAULTS_LIST);
    const savingState = useHookState(SAVING);
    const vaultItem = useMemo(() => {
        const vaultList = vaultListState.get();
        return vaultList.find(item => item.id === props.sourceID) || null;
    }, [vaultListState.get()]);
    const themeType = useTheme();
    useEffect(() => {
        if (vaultItem && vaultItem.state === VaultSourceStatus.Unlocked) {
            fetchUpdatedFacade(vaultItem.id);
        }
    }, [props.sourceID, vaultItem?.state]);
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
    // Optional rendering
    if (!vaultItem) return null;
    if (vaultItem.state !== VaultSourceStatus.Unlocked) {
        return <span>Not unlocked</span>;
    }
    // Normal output
    return (
        <>
            {currentFacade && (
                <ThemeProvider theme={themeType === Theme.Dark ? themes.dark : themes.light}>
                    <VaultProvider
                        icons
                        iconsPath="icons"
                        onSelectEntry={setSelectedEntryID}
                        onSelectGroup={setSelectedGroupID}
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
