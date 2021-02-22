import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { VaultSourceStatus } from "buttercup";
import { Button, Intent } from "@blueprintjs/core";
import { Generator } from "@buttercup/ui";
import { VAULTS_LIST } from "../../state/vaults";
import { showAddVaultMenu } from "../../state/addVault";
import { unlockVaultSource } from "../../actions/unlockVault";
import { lockVaultSource } from "../../actions/lockVault";
import { removeVaultSource } from "../../actions/removeVault";
import { VaultsSidebarButton } from "./VaultsSidebarButton";
import { ConfirmDialog } from "../prompt/ConfirmDialog";
import { VaultSourceDescription } from "../../types";

const { useCallback, useState } = React;

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
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const [removingSource, setRemovingSource] = useState<VaultSourceDescription>(null);
    const [showGenerator, setShowGenerator] = useState(false);
    const handleLinkClick = useCallback((vaultItem: VaultSourceDescription) => {
        if (vaultItem.state === VaultSourceStatus.Locked) {
            unlockVaultSource(vaultItem.id);
        }
    }, []);
    const handleLock = useCallback((vaultItem: VaultSourceDescription) => {
        if (vaultItem.state === VaultSourceStatus.Unlocked) {
            lockVaultSource(vaultItem.id);
        }
    }, []);
    const handleUnlock = useCallback((vaultItem: VaultSourceDescription) => {
        if (vaultItem.state === VaultSourceStatus.Locked) {
            unlockVaultSource(vaultItem.id);
        }
    }, []);
    const handleRemoveDialogClose = useCallback((didConfirm: boolean) => {
        if (didConfirm) {
            removeVaultSource(removingSource.id);
        }
        setRemovingSource(null);
    }, [removingSource]);
    return (
        <>
            <SidebarContainer>
                <VaultsListContainer>
                    {vaultsState.get().map(vaultItem => (
                        <VaultsSidebarButton
                            key={vaultItem.id}
                            onClick={() => {
                                handleLinkClick(vaultItem);
                                history.push(`/source/${vaultItem.id}`);
                            }}
                            onLock={() => {
                                handleLock(vaultItem);
                                history.push("/");
                            }}
                            onRemove={() => setRemovingSource(vaultItem)}
                            onUnlock={() => {
                                handleUnlock(vaultItem);
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
                            onClick={() => showAddVaultMenu(true)}
                            text="Add"
                        />
                        <Generator
                            onGenerate={() => setShowGenerator(false)}
                            isOpen={showGenerator}
                        >
                            <Button
                                icon="key"
                                minimal
                                onClick={() => setShowGenerator(!showGenerator)}
                                text="Generate"
                            />
                        </Generator>
                    </BottomMenu>
                </VaultsListContainer>
            </SidebarContainer>
            <ConfirmDialog
                confirmIntent={Intent.WARNING}
                confirmText="Remove"
                onClose={handleRemoveDialogClose}
                open={!!removingSource}
                title="Remove Vault"
            >
                {removingSource && `Are you sure that you want to remove "${removingSource.name}"?`}
            </ConfirmDialog>
        </>
    );
}
