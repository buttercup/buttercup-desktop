import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Alignment, Button, ButtonGroup, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";
import { useState as useHookState } from "@hookstate/core";
import { lockVaultSource } from "../../actions/lockVault";
import { CURRENT_VAULT } from "../../state/vaults";
import { t } from "../../../shared/i18n/trans";

const { useCallback, useState } = React;

export type VaultSidebarItem = "contents";

interface VaultSidebarProps {
    onSelect: (item: VaultSidebarItem) => void;
    selected: null | VaultSidebarItem;
}

const SidebarContainer = styled.div`
    width: 60px;
    padding: 10px 0px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;

export function VaultSidebar(props: VaultSidebarProps) {
    const history = useHistory();
    const currentVaultState = useHookState(CURRENT_VAULT);
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
                <Button
                    active={selectedItem === "contents"}
                    icon="control"
                    large
                    minimal
                    onClick={() => handleSelection("contents")}
                    title={t("vault-sidebar.vault-contents")}
                />
                {/* <Button
                    disabled
                    icon="barcode"
                    large
                    minimal
                    title="OTP Codes"
                />
                <Button
                    disabled
                    icon="paperclip"
                    large
                    minimal
                    title="Attachments"
                />
                <Button
                    disabled
                    icon="diagnosis"
                    large
                    minimal
                    title="Vault optimisation"
                />
                <Button
                    disabled
                    icon="console"
                    large
                    minimal
                    title="Vault terminal"
                />
                <Button
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
                    <Button
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
