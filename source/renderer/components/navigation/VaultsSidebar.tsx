import * as React from "react";
import styled from "styled-components";
import { useState } from "@hookstate/core";
import { VaultSourceStatus } from "buttercup";
import { useHistory } from "react-router-dom";
import { Button, Intent } from "@blueprintjs/core";
import { VAULTS_LIST } from "../../state/vaults";
import { startAddFileVault } from "../../actions/addVault";
import { unlockVaultSource } from "../../actions/unlockVault";
import { VaultsSidebarButton } from "./VaultsSidebarButton";
import { VaultSourceDescription } from "../../types";

const { useCallback } = React;

const SidebarContainer = styled.div`
    width: 100px;
    padding: 10px 0px;
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
    const vaultsState = useState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const handleLinkClick = useCallback((vaultItem: VaultSourceDescription) => {
        if (vaultItem.state === VaultSourceStatus.Locked) {
            unlockVaultSource(vaultItem.id);
        }
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
                ))}
                <BottomMenu>
                    <Button
                        icon="add"
                        intent={Intent.PRIMARY}
                        minimal
                        onClick={() => startAddFileVault()}
                        text="Add"
                    />
                </BottomMenu>
            </VaultsListContainer>
        </SidebarContainer>
    );
}
