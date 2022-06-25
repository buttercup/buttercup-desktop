
import React, { useMemo } from "react";
import { useState as useHookState } from "@hookstate/core";
import { VaultSourceID } from "buttercup";
import { Tabs } from "@buttercup/ui";
import { sortVaults } from "../../library/vault";
import { getIconForProvider } from "../../library/icons";
import { CURRENT_VAULT, VAULTS_LIST } from "../../state/vaults";
import { VaultSourceDescription } from "../../types";

export interface Tab {
    content: string;
    icon: string;
    id: VaultSourceID;
}

interface VaultTabsProps {
    onAddVault: () => void;
    onReorder: (tabs: Array<Tabs>) => void;
    onSelectVault: (sourceID: VaultSourceID) => void;
    sourceID: VaultSourceID;
    // tabs: Array<Tab>;
}

export function VaultTabs(props: VaultTabsProps) {
    const { onAddVault, onReorder, onSelectVault, sourceID } = props;
    // const currentVaultState = useHookState(CURRENT_VAULT);
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const vaults = useMemo(() => sortVaults([...vaultsState.get()]), [vaultsState]);
    const tabs: Array<Tab> = useMemo(() => vaults.map(vault => ({
        content: vault.name,
        id: vault.id,
        icon: getIconForProvider(vault.type)
    })), [vaults]);
    return (
        <Tabs
            onAdd={() => onAddVault()}
            onClose={() => {}}
            onReorder={onReorder}
            onSelect={onSelectVault}
            selected={sourceID}
            tabs={tabs}
        />
    );
}
