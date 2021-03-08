import * as React from "react";
import { useState } from "@hookstate/core";
import { VaultProvider, VaultUI, themes } from "@buttercup/ui";
import { VaultFacade, VaultSourceStatus } from "buttercup";
import { ThemeProvider } from "styled-components";
import { VAULTS_LIST } from "../state/vaults";
import { SAVING } from "../state/app";
import { fetchUpdatedFacade } from "../actions/facade";
import { saveVaultFacade } from "../actions/saveVault";
import { useCurrentFacade } from "../hooks/facade";
import { useTheme } from "../hooks/theme";
import { Theme } from "../types";

import "@buttercup/ui/dist/styles.css";

const { useEffect, useMemo } = React;

interface VaultEditorProps {
    sourceID: string;
}

function renderFacade(
    facade: VaultFacade,
    onUpdate: (facade: VaultFacade) => void,
    theme: Theme,
    isSaving: boolean = false
) {
    return (
        <ThemeProvider theme={theme === Theme.Dark ? themes.dark : themes.light}>
            <VaultProvider
                vault={facade}
                icons
                iconsPath="icons"
                onUpdate={(vaultFacade: VaultFacade) => {
                    onUpdate(vaultFacade);
                }}
                readOnly={isSaving}
            >
                <VaultUI />
            </VaultProvider>
        </ThemeProvider>
    );
}

export function VaultEditor(props: VaultEditorProps) {
    const currentFacade = useCurrentFacade();
    const vaultListState = useState(VAULTS_LIST);
    const savingState = useState(SAVING);
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
    // Optional rendering
    if (!vaultItem) return null;
    if (vaultItem.state !== VaultSourceStatus.Unlocked) {
        return <span>Not unlocked</span>;
    }
    // Normal output
    return (
        <>
            {currentFacade && renderFacade(
                currentFacade,
                facade => {
                    saveVaultFacade(vaultItem.id, facade);
                },
                themeType,
                savingState.get()
            )}
        </>
    );
}
