import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { VaultSourceStatus } from "buttercup";
import { Alignment, Button, ButtonGroup, Classes, Colors, Divider, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";
import { useState as useHookState } from "@hookstate/core";
import { lockVaultSource } from "../../actions/lockVault";
import { getIconForProvider } from "../../library/icons";
import { sortVaults } from "../../library/vault";
import { CURRENT_VAULT, VAULTS_LIST, setShowVaultManagement } from "../../state/vaults";
import { VAULTS_WITH_BIOMETRICS } from "../../state/biometrics";
import { getThemeProp } from "../../styles/theme";
import { t } from "../../../shared/i18n/trans";
import { VaultSourceDescription } from "../../types";

interface VaultHoverDescriptionProps {
    visible: boolean;
}

export type VaultSidebarItem = "contents";

interface VaultSidebarProps {
    onSelect: (item: VaultSidebarItem, sourceID?: string) => void;
    selected: null | VaultSidebarItem;
    sourceID: string;
}

const SidebarButton = styled(Button)`
    border-radius: 0px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    position: relative;
    > img {
        margin: 0px !important;
    }
    > .${Classes.BUTTON_TEXT} {
        display: flex;
        align-items: center;
    }
`;
const SidebarButtonIcon = styled(Icon)`
    width: 10px;
    height: 10px;
    margin: 0 0 0 6px !important;
`;
const SidebarContainer = styled.div`
    width: 72px;
    padding: 10px 0px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;
const VaultHoverDescription = styled.div<VaultHoverDescriptionProps>`
    visibility: ${p => p.visible ? "visible" : "hidden"};
    opacity: ${p => p.visible ? 1 : 0};
    transition: visibility 0.25s, opacity 0.25s linear;
    display: flex;
    position: absolute;
    height: 100%;
    width: 260px;
    background: linear-gradient(to right, ${props => getThemeProp(props, "sidebar.hoverName.bgColor")} 75%, rgba(0,0,0,0) 97%);
    left: 100%;
    flex-flow: row no-wrap;
    overflow: hidden;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    color: ${props => getThemeProp(props, "sidebar.hoverName.color")};
    font-size: 15px;
`;
const VaultIcon = styled.img`
    height: 24px;
    max-width: 24px;
    width: auto;
`;

export function VaultSidebar(props: VaultSidebarProps) {
    const history = useHistory();
    const currentVaultState = useHookState(CURRENT_VAULT);
    const biometricVaultsState = useHookState(VAULTS_WITH_BIOMETRICS);
    const vaultsState = useHookState<Array<VaultSourceDescription>>(VAULTS_LIST);
    const vaults = useMemo(() => sortVaults([...vaultsState.get()]), [vaultsState]);
    const { onSelect: handleSelection, selected: selectedItem, sourceID: selectedSourceID } = props;
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [hoveringSource, setHoveringSource] = useState(null);
    const handleVaultClick = useCallback(sourceID => {
        setHoveringSource(null);
        handleSelection("contents", sourceID);
    }, [handleSelection]);
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
                {vaults.map(vault => (
                    <SidebarButton
                        active={vault.id === selectedSourceID}
                        icon={(
                            <VaultIcon src={getIconForProvider(vault.type)} />
                        )}
                        key={vault.id}
                        large
                        onClick={() => handleVaultClick(vault.id)}
                        onMouseEnter={() => setHoveringSource(vault.id)}
                        onMouseLeave={() => setHoveringSource(null)}
                        text={(
                            <SidebarButtonIcon
                                color={vault.state === VaultSourceStatus.Locked ? Colors.GRAY1 : Colors.GREEN3}
                                icon={
                                    vault.state === VaultSourceStatus.Locked
                                        ? biometricVaultsState.get().includes(vault.id) ? "eye-open" : "lock"
                                        : "unlock"
                                }
                                iconSize={10}
                            />
                        )}
                        title={vault.name}
                    >
                        <VaultHoverDescription
                            visible={hoveringSource === vault.id}
                        >
                            {vault.name}
                        </VaultHoverDescription>
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
                            <MenuItem
                                text={t("vault-sidebar.options-popup.manage-vaults")}
                                icon="numbered-list"
                                onClick={() => setShowVaultManagement(true)}
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
