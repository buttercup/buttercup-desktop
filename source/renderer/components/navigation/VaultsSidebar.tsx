import * as React from "react";
import styled from "styled-components";
import { useState } from "@hookstate/core";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { useHistory } from "react-router-dom";
import { CURRENT_VAULT, VAULTS_LIST } from "../../state/vaults";
import { startAddFileVault } from "../../actions/addVault";
import { unlockVaultSource } from "../../actions/unlockVault";
import { VaultsSidebarButton } from "./VaultsSidebarButton";
import { VaultSourceDescription } from "../../types";

const { useCallback } = React;

const SidebarContainer = styled.div`
    width: 100px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;
const VaultsListContainer = styled.div`
    flex: 2 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
const BottomMenu = styled.div`
    flex: 1 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
`;

export function VaultsSidebar() {
    const history = useHistory();
    // const currentVaultState = useState<VaultSourceID>(CURRENT_VAULT);
    const vaultsState = useState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const handleLinkClick = useCallback((vaultItem: VaultSourceDescription) => {
        if (vaultItem.state === VaultSourceStatus.Locked) {
            unlockVaultSource(vaultItem.id);
        }
        // if (currentVaultState.get() === vaultItem.id) {
        //     event.preventDefault();
        // }
    }, []);
    return (
        <SidebarContainer>
            <VaultsListContainer>
                {vaultsState.get().map(vaultItem => (
                    <VaultsSidebarButton
                        onClick={() => {
                            handleLinkClick(vaultItem);
                            history.push(`/source/${vaultItem.id}`);
                        }}
                        vault={vaultItem}
                    />
                    // <Link
                    //     to={`/source/${vaultItem.id}`}
                    //     key={vaultItem.id}
                    //     onClick={evt => handleLinkClick(evt, vaultItem)}
                    // >
                    //     {vaultItem.name}
                    // </Link>
                ))}
                <BottomMenu>
                    <button onClick={() => startAddFileVault()}>Add</button>
                </BottomMenu>
            </VaultsListContainer>
        </SidebarContainer>
    );
}
