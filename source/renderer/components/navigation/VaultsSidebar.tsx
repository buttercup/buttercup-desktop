import * as React from "react";
import styled from "styled-components";
import { useState } from "@hookstate/core";
import { Link } from "react-router-dom";
import { VAULTS_LIST } from "../../state/vaults";
import { startAddFileVault } from "../../actions/addVault";
import { VaultSourceDescription } from "../../types";

const SidebarContainer = styled.div`
    width: 120px;
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
    const vaultsState = useState<Array<VaultSourceDescription>>(VAULTS_LIST);
    return (
        <SidebarContainer>
            <VaultsListContainer>
                {vaultsState.get().map(vaultItem => (
                    <Link to={`/source/${vaultItem.id}`} key={vaultItem.id}>{vaultItem.name}</Link>
                ))}
                <BottomMenu>
                    <button onClick={() => startAddFileVault()}>Add</button>
                </BottomMenu>
            </VaultsListContainer>
        </SidebarContainer>
    );
}
