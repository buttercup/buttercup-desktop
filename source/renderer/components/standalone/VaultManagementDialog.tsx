import React, { Fragment, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useState as useHookState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { Button, ButtonGroup, Card, Classes, Dialog, Intent } from "@blueprintjs/core";
import { setVaultSourceOrder } from "../../actions/vaultOrder";
import { removeVaultSource } from "../../actions/removeVault";
import { handleError } from "../../actions/error";
import { SHOW_VAULT_MGMT, VAULTS_LIST } from "../../state/vaults";
import { getIconForProvider } from "../../library/icons";
import { sortVaults } from "../../library/vault";
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
    const history = useHistory();
    const showDialogState = useHookState(SHOW_VAULT_MGMT);
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const vaults = useMemo(() => sortVaults([...vaultsState.get()]), [vaultsState.get()]);
    const [removeSourceID, setRemoveSourceID] = useState<string>(null);
    const removeSourceTitle = useMemo(() => {
        const source = vaultsState.get().find(item => item.id === removeSourceID);
        return source && source.name || "";
    }, [removeSourceID, vaultsState]);
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
    const removeSource = useCallback(async sourceID => {
        const vaultsCount = vaultsState.get().length;
        setRemoveSourceID(null);
        await removeVaultSource(sourceID);
        if (vaultsCount <= 1) {
            history.push("/");
            close();
        }
    }, [history, vaultsState.get()]);
    return (
        <Fragment>
            <Dialog isOpen={showDialogState.get()} onClose={close}>
                <div className={Classes.DIALOG_HEADER}>{t("vault-management.title")}</div>
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
                                        disabled={!!removeSourceID}
                                        icon="trash"
                                        intent={Intent.DANGER}
                                        minimal
                                        onClick={() => setRemoveSourceID(vault.id)}
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
                            title={t("vault-management.close-button-title")}
                        >
                            {t("vault-management.close-button")}
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={removeSourceID !== null} onClose={() => setRemoveSourceID(null)}>
                <div className={Classes.DIALOG_HEADER}>{t("vault-management.remove-vault-dialog.title")}</div>
                <div className={Classes.DIALOG_BODY}>
                    <p>{t("vault-management.remove-vault-dialog.description", { title: removeSourceTitle })}</p>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            intent={Intent.DANGER}
                            onClick={() => removeSource(removeSourceID)}
                            title={t("vault-management.remove-vault-dialog.remove-button-title")}
                        >
                            {t("vault-management.remove-vault-dialog.remove-button")}
                        </Button>
                        <Button
                            onClick={() => setRemoveSourceID(null)}
                            title={t("vault-management.remove-vault-dialog.cancel-button-title")}
                        >
                            {t("vault-management.remove-vault-dialog.cancel-button")}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    );
}
