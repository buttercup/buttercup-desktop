import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { Button, ButtonGroup, Card, Classes, Dialog, Intent } from "@blueprintjs/core";
import { setVaultSourceOrder } from "../../actions/vaultOrder";
import { handleError } from "../../actions/error";
import { SHOW_VAULT_MGMT, VAULTS_LIST } from "../../state/vaults";
import { getIconForProvider } from "../../library/icons";
import { t } from "../../../shared/i18n/trans";
import { VaultSourceDescription } from "../../types";

const VaultCard = styled(Card)`
    padding: 6px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`;
const VaultCardTitle = styled.h4`
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
`;
const VaultsContainer = styled.div`
    margin: 10px 40px;
`;
const VaultIcon = styled.img`
    height: 24px;
    max-width: 24px;
    width: auto;
    margin-right: 10px;
`;

export function VaultManagementDialog() {
    const showDialogState = useHookState(SHOW_VAULT_MGMT);
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const vaults = useMemo(() => [...vaultsState.get()].sort((a, b) => {
        if (a.order > b.order) {
            return 1;
        } else if (b.order > a.order) {
            return -1;
        }
        return 0;
    }), [vaultsState.get()]);
    const close = useCallback(() => {
        showDialogState.set(false);
    }, []);
    const handleVaultReorder = useCallback((sourceID: VaultSourceID, direction: "up" | "down") => {
        const vaults = vaultsState.get();
        const vault = vaults.find(vault => vault.id === sourceID);
        setVaultSourceOrder(
            vault.id,
            direction === "up"
                ? Math.max(0, vault.order - 1)
                : Math.min(vaults.length -1, vault.order + 1)
        ).catch(handleError);
    }, [vaultsState]);
    return (
        <Dialog isOpen={showDialogState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Vaults</div>
            <div className={Classes.DIALOG_BODY}>
                <VaultsContainer>
                    {vaults.map(vault => (
                        <VaultCard
                            key={vault.id}
                        >
                            <VaultCardTitle>
                                <VaultIcon src={getIconForProvider(vault.type)} />
                                {vault.name}
                            </VaultCardTitle>
                            <ButtonGroup>
                                <Button
                                    disabled={vault.order === 0}
                                    icon="arrow-up"
                                    minimal
                                    onClick={() => handleVaultReorder(vault.id, "up")}
                                />
                                <Button
                                    disabled={vault.order === (vaults.length - 1)}
                                    icon="arrow-down"
                                    minimal
                                    onClick={() => handleVaultReorder(vault.id, "down")}
                                />
                                <Button
                                    icon="trash"
                                    intent={Intent.DANGER}
                                    minimal
                                />
                            </ButtonGroup>
                        </VaultCard>
                    ))}
                </VaultsContainer>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button
                        onClick={close}
                        title="Close"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}
