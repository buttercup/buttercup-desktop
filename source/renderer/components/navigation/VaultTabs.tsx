
import React, { useMemo } from "react";
import { VaultSourceID, VaultSourceStatus } from "buttercup";
import { useSingleState } from "react-obstate";
import { Tabs } from "@buttercup/ui";
import { Intent, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { sortVaults } from "../../library/vault";
import { getIconForProvider } from "../../library/icons";
import { VAULTS_STATE } from "../../state/vaults";
import { showVaultSettingsForSource } from "../../state/vaultSettings";
import { t } from "../../../shared/i18n/trans";

export interface Tab {
    available: boolean;
    content: string;
    icon: string;
    id: VaultSourceID;
}

interface TabMenuProps {
    id: VaultSourceID;
    onLockVault: (sourceID: VaultSourceID) => void;
    onRemoveVault: (sourceID: VaultSourceID) => void;
    onUnlockVault: (sourceID: VaultSourceID) => void;
}

interface VaultTabsProps {
    onAddVault: () => void;
    onLockVault: (sourceID: VaultSourceID) => void;
    onRemoveVault: (sourceID: VaultSourceID) => void;
    onReorder: (tabs: Array<Tabs>) => void;
    onSelectVault: (sourceID: VaultSourceID) => void;
    onUnlockVault: (sourceID: VaultSourceID) => void;
    sourceID: VaultSourceID;
}

function TabMenu(props: TabMenuProps) {
    const {
        id,
        onLockVault,
        onRemoveVault,
        onUnlockVault
    } = props;
    const [vaults] = useSingleState(VAULTS_STATE, "vaultsList");
    const vaultDetails = useMemo(() => vaults.find(item => item.id === id), [id, vaults]);
    return (
        <Menu>
            <MenuItem
                disabled
                text={vaultDetails?.state ? t(`vault-editor.${vaultDetails.state}-state`) : ""}
            />
            <MenuDivider />
            <MenuItem
                disabled={vaultDetails?.state === VaultSourceStatus.Unlocked}
                icon="unlock"
                onClick={() => onUnlockVault(id)}
                text={t("vault-tabs.context-menu.unlock-vault")}
            />
            <MenuItem
                disabled={vaultDetails?.state === VaultSourceStatus.Locked}
                icon="lock"
                onClick={() => onLockVault(id)}
                text={t("vault-tabs.context-menu.lock-vault")}
            />
            <MenuDivider />
            <MenuItem
                disabled={vaultDetails?.state === VaultSourceStatus.Pending}
                icon="remove"
                intent={Intent.WARNING}
                onClick={() => onRemoveVault(id)}
                text={t("vault-tabs.context-menu.remove-vault")}
            />
            <MenuDivider />
            <MenuItem
                icon="settings"
                onClick={() => showVaultSettingsForSource(id)}
                text={t("vault-tabs.context-menu.vault-settings")}
            />
        </Menu>
    );
}

export function VaultTabs(props: VaultTabsProps) {
    const { onAddVault, onLockVault, onRemoveVault, onReorder, onSelectVault, onUnlockVault, sourceID } = props;
    const [rawVaults] = useSingleState(VAULTS_STATE, "vaultsList");
    const vaults = useMemo(() => sortVaults(rawVaults), [rawVaults]);
    const tabs = useMemo(() => vaults.map(vault => ({
        content: vault.name,
        id: vault.id,
        icon: getIconForProvider(vault.type),
        available: vault.state === VaultSourceStatus.Unlocked
    } satisfies Tab)), [vaults]);
    return (
        <Tabs
            menu={(props: Partial<TabMenuProps> & { id: VaultSourceID; }) => (
                <TabMenu
                    {...props}
                    onLockVault={onLockVault}
                    onRemoveVault={onRemoveVault}
                    onUnlockVault={onUnlockVault}
                />
            )}
            onAdd={onAddVault}
            onClose={onRemoveVault}
            onReorder={onReorder}
            onSelect={onSelectVault}
            selected={sourceID}
            tabs={tabs}
        />
    );
}
