import * as React from "react";
import { useState } from "@hookstate/core";
import { VaultProvider, VaultUI, themes } from "@buttercup/ui";
import { VaultFacade, VaultSourceStatus } from "buttercup";
import { ThemeProvider } from "styled-components";
import { CURRENT_FACADE, VAULTS_LIST } from "../state/vaults";
import { SAVING } from "../state/app";
import { fetchUpdatedFacade } from "../actions/facade";
import { saveVaultFacade } from "../actions/saveVault";

import "@buttercup/ui/dist/styles.css";

const { useEffect, useMemo } = React;

interface VaultEditorProps {
    sourceID: string;
}

function renderFacade(facade: VaultFacade, onUpdate: (facade: VaultFacade) => void, isSaving: boolean = false) {
    return (
        <ThemeProvider theme={true ? themes.dark : themes.light}>
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
    const currentFacadeState = useState(CURRENT_FACADE);
    const vaultListState = useState(VAULTS_LIST);
    const savingState = useState(SAVING);
    const vaultItem = useMemo(() => {
        const vaultList = vaultListState.get();
        return vaultList.find(item => item.id === props.sourceID) || null;
    }, [vaultListState.get()]);
    useEffect(() => {
        if (vaultItem && vaultItem.state === VaultSourceStatus.Unlocked) {
            fetchUpdatedFacade(vaultItem.id);
        }
    }, [props.sourceID, vaultItem?.state]);
    const facade = currentFacadeState.get();
    // Optional rendering
    if (!vaultItem) return null;
    if (vaultItem.state !== VaultSourceStatus.Unlocked) {
        return <span>Not unlocked</span>;
    }
    // Normal output
    return (
        <>
            {facade && renderFacade(
                facade,
                facade => {
                    saveVaultFacade(vaultItem.id, facade);
                },
                savingState.get()
            )}
        </>
    );
}
