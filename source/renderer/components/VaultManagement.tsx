import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import cn from "classnames";
import styled from "styled-components";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { VaultEditor } from "./VaultEditor";
import { VaultSearchManager } from "./search/VaultSearchManager";
import { SearchProvider } from "./search/SearchContext";
import { VAULTS_LIST } from "../state/vaults";
import { unlockVaultSource } from "../actions/unlockVault";
import { handleError } from "../actions/error";
import { useTheme } from "../hooks/theme";
import { ErrorBoundary } from "./ErrorBoundary";
import { Theme, VaultSourceDescription } from "../types";
import { Tab, VaultTabs } from "./navigation/VaultTabs";
import { setVaultSourcesOrder } from "../actions/vaultOrder";
import { logErr } from "../library/log";

const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;
const ContentContainer = styled.div`
    flex: 10 10 auto;
    height: 100%;
`;

export function VaultManagement() {
    const { id = null } = useParams();
    const history = useHistory();
    const themeType = useTheme();
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const handleSourceUnlockRequest = useCallback((sourceID: VaultSourceID) => {
        const vault = vaultsState.get().find(vault => vault.id === sourceID);
        if (vault.state === VaultSourceStatus.Locked) {
            unlockVaultSource(sourceID).catch(handleError);
        }
    }, [vaultsState]);
    const handleSourceSelect = useCallback((sourceID: VaultSourceID) => {
        history.push(`/source/${sourceID}`);
    }, [history, id]);
    const handleSourcesReoder = useCallback((newTabsOrder: Array<Tab>) => {
        setVaultSourcesOrder(newTabsOrder.map(tab => tab.id)).catch(err => {
            logErr("Failed reordering vaults", err);
        });
    }, []);
    return (
        <PrimaryContainer>
            <SearchProvider>
                <VaultTabs
                    onAddVault={() => {}}
                    onReorder={handleSourcesReoder}
                    onSelectVault={handleSourceSelect}
                    sourceID={id}
                />
                <ContentContainer className={cn({
                    "bp4-dark": themeType === Theme.Dark
                })}>
                    {id && (
                        <ErrorBoundary>
                            {id && (
                                <VaultEditor onUnlockRequest={() => handleSourceUnlockRequest(id)} sourceID={id} />
                            )}
                        </ErrorBoundary>
                    )}
                </ContentContainer>
                <VaultSearchManager sourceID={id} />
            </SearchProvider>
        </PrimaryContainer>
    );
}
