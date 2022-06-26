import React, { useCallback, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import cn from "classnames";
import styled from "styled-components";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { useState as useHookState } from "@hookstate/core";
import { VaultEditor } from "./VaultEditor";
import { VaultSearchManager } from "./search/VaultSearchManager";
import { SearchProvider } from "./search/SearchContext";
import { ConfirmDialog } from "./prompt/ConfirmDialog";
import { VAULTS_LIST } from "../state/vaults";
import { unlockVaultSource } from "../actions/unlockVault";
import { handleError } from "../actions/error";
import { useTheme } from "../hooks/theme";
import { ErrorBoundary } from "./ErrorBoundary";
import { Theme, VaultSourceDescription } from "../types";
import { Tab, VaultTabs } from "./navigation/VaultTabs";
import { setVaultSourcesOrder } from "../actions/vaultOrder";
import { logErr, logInfo } from "../library/log";
import { t } from "../../shared/i18n/trans";
import { Intent } from "@blueprintjs/core";
import { removeVaultSource } from "../actions/removeVault";
import { showSuccess } from "../services/notifications";

const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;
const ContentContainer = styled.div`
    margin-top: 1px;
    flex: 10 10 auto;
    height: 100%;
`;

export function VaultManagement() {
    const { id = null } = useParams();
    const history = useHistory();
    const themeType = useTheme();
    const [removingSourceID, setRemovingSourceID] = useState<VaultSourceID>(null);
    const [currentTitle, setCurrentTitle] = useState<VaultSourceID>(null);
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
    const handleSourceRemove = useCallback((sourceID: VaultSourceID) => {
        setRemovingSourceID(sourceID);
        setCurrentTitle(vaultsState.get().find(source => source.id === sourceID).name);
    }, [vaultsState]);
    const handleSourceRemoveConfirm = useCallback((remove: boolean) => {
        if (remove) {
            removeVaultSource(removingSourceID)
                .then(() => {
                    showSuccess(t("notification.vault-removed", { name: currentTitle }));
                })
                .catch(err => {
                    logErr("Failed removing source", err);
                });
        }
        setRemovingSourceID(null);
        setCurrentTitle(null);
    }, [removingSourceID]);
    return (
        <PrimaryContainer>
            <SearchProvider>
                <VaultTabs
                    onAddVault={() => {}}
                    onRemoveVault={handleSourceRemove}
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
            <ConfirmDialog
                cancelText={t("vault-management.remove-vault-dialog.cancel-button")}
                confirmText={t("vault-management.remove-vault-dialog.remove-button")}
                confirmIntent={Intent.WARNING}
                onClose={handleSourceRemoveConfirm}
                open={!!removingSourceID}
                title={t("vault-management.remove-vault-dialog.title")}
            >
                {t("vault-management.remove-vault-dialog.description", { title: currentTitle })}
            </ConfirmDialog>
        </PrimaryContainer>
    );
}
