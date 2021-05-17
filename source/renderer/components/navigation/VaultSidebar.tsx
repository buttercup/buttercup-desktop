import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Alignment, Button, ButtonGroup, Divider, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";
import { useState as useHookState } from "@hookstate/core";
import { lockVaultSource } from "../../actions/lockVault";
import { getIconForProvider } from "../../library/icons";
import { CURRENT_VAULT, VAULTS_LIST } from "../../state/vaults";
import { t } from "../../../shared/i18n/trans";
import { VaultSourceDescription } from "../../types";

const { useCallback, useState } = React;

export type VaultSidebarItem = "contents";

interface VaultSidebarProps {
    onSelect: (item: VaultSidebarItem) => void;
    selected: null | VaultSidebarItem;
}

const SidebarButton = styled(Button)`
    border-radius: 0px;
    > img {
        margin: 0px !important;
    }
`;
const SidebarButtonCornerIcon = styled(Icon)`
    position: absolute;
    top: calc(50% - 5px);
    left: calc(50% - 16px);
`;
const SidebarContainer = styled.div`
    width: 60px;
    padding: 10px 0px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;
const VaultIcon = styled.img`
    width: 100%;
    height: auto;
`;

export function VaultSidebar(props: VaultSidebarProps) {
    const history = useHistory();
    const currentVaultState = useHookState(CURRENT_VAULT);
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const { onSelect: handleSelection, selected: selectedItem } = props;
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const handleVaultLock = useCallback(async () => {
        const sourceID = currentVaultState.get();
        await lockVaultSource(sourceID);
        history.push("/");
    }, [currentVaultState]);
    return (
        <SidebarContainer>
            <ButtonGroup
                alignText={Alignment.LEFT}
                minimal
                vertical
            >
                {vaultsState.get().map(vault => (
                    <SidebarButton
                        active={vault.id === currentVaultState.get()}
                        icon={(
                            <VaultIcon src={getIconForProvider(vault.type)} />
                        )}
                        large
                        minimal
                        onClick={() => handleSelection("contents")}
                        title={vault.name}
                    >
                        <SidebarButtonCornerIcon icon="lock" iconSize={10} />
                    </SidebarButton>
                ))}
                <Divider />
                {/* <SidebarButton
                    active={selectedItem === "contents"}
                    icon="control"
                    large
                    minimal
                    onClick={() => handleSelection("contents")}
                    title={t("vault-sidebar.vault-contents")}
                /> */}
                {/* <SidebarButton
                    disabled
                    icon="barcode"
                    large
                    minimal
                    title="OTP Codes"
                />
                <SidebarButton
                    disabled
                    icon="paperclip"
                    large
                    minimal
                    title="Attachments"
                />
                <SidebarButton
                    disabled
                    icon="diagnosis"
                    large
                    minimal
                    title="Vault optimisation"
                />
                <SidebarButton
                    disabled
                    icon="console"
                    large
                    minimal
                    title="Vault terminal"
                />
                <SidebarButton
                    disabled
                    icon="key"
                    large
                    minimal
                    title="Password generator"
                /> */}
                <Popover
                    content={
                        <Menu>
                            <MenuItem
                                text={t("vault-sidebar.options-popup.lock-current-vault")}
                                icon="lock"
                                onClick={handleVaultLock}
                            />
                            <MenuDivider />
                            <MenuItem
                                text={t("vault-sidebar.options-popup.choose-vault")}
                                icon="menu"
                                onClick={() => history.push("/")}
                            />
                        </Menu>
                    }
                    isOpen={showMoreMenu}
                    onClose={() => setShowMoreMenu(false)}
                >
                    <SidebarButton
                        icon="more"
                        large
                        minimal
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                    />
                </Popover>
            </ButtonGroup>
        </SidebarContainer>
    );
}
