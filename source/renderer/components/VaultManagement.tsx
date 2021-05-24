import React, { useCallback, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { VaultSourceStatus } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { VaultSidebar, VaultSidebarItem } from "./navigation/VaultSidebar";
import { VaultEditor } from "./VaultEditor";
import { VaultSearchManager } from "./search/VaultSearchManager";
import { SearchProvider } from "./search/SearchContext";
import { VAULTS_LIST } from "../state/vaults";
import { unlockVaultSource } from "../actions/unlockVault";
import { handleError } from "../actions/error";
import { ErrorBoundary } from "./ErrorBoundary";
import { VaultSourceDescription } from "../types";

const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
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
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const [selectedSidebarItem, setSelectedSidebarItem] = useState<VaultSidebarItem>("contents");
    const handleSidebarItemSelect = useCallback((item: VaultSidebarItem, sourceID?: string) => {
        setSelectedSidebarItem(item);
        if (sourceID) {
            history.push(`/source/${sourceID}`);
            const vault = vaultsState.get().find(vault => vault.id === sourceID);
            if (vault.state === VaultSourceStatus.Locked) {
                unlockVaultSource(sourceID).catch(handleError);
            }
        }
    }, []);
    return (
        <PrimaryContainer>
            <SearchProvider>
                <VaultSidebar
                    onSelect={handleSidebarItemSelect}
                    selected={selectedSidebarItem}
                    sourceID={id}
                />
                <ContentContainer>
                    {id && (
                        <ErrorBoundary>
                            {selectedSidebarItem === "contents" && <VaultEditor sourceID={id} />}
                        </ErrorBoundary>
                    )}
                </ContentContainer>
                <VaultSearchManager sourceID={id} />
            </SearchProvider>
        </PrimaryContainer>
    );
}
