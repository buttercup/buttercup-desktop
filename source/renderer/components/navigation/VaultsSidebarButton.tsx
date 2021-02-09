import * as React from "react";
import styled from "styled-components";
import { Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { Popover2 as Popover, Popover2InteractionKind as PopoverInteractionKind } from "@blueprintjs/popover2";
import { VaultSourceStatus } from "buttercup";
import { getThemeProp } from "../../styles/theme";
import { VaultSourceDescription } from "../../../shared/types";

const { useState } = React;

interface VaultsSidebarButtonProps {
    onClick: (vault: VaultSourceDescription) => void;
    vault: VaultSourceDescription;
}

const Button = styled.button`
    border: 2px solid ${props => getThemeProp(props, "sidebar.button.borderColor")};
    background-color: ${props => getThemeProp(props, "sidebar.button.bgColor")};
    border-radius: 3px;
    outline: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    margin: 5px;
    cursor: pointer;
`;

export function VaultsSidebarButton(props: VaultsSidebarButtonProps) {
    const { onClick, vault } = props;
    const [showContextMenu, setShowContextMenu] = useState(false);
    return (
        <Popover
            content={
                <Menu>
                    <MenuItem text="Unlock" icon="unlock" disabled={vault.state === VaultSourceStatus.Unlocked} />
                    <MenuItem text="Lock" icon="lock" disabled={vault.state === VaultSourceStatus.Locked} />
                    <MenuDivider />
                    <MenuItem text="Info" icon="info-sign" disabled />
                    <MenuItem text="Optimise" icon="clean" disabled />
                    <MenuItem text="Backup" icon="send-to" disabled />
                    <MenuDivider />
                    <MenuItem text="Remove" icon="cross" />
                </Menu>
            }
            isOpen={showContextMenu}
            onClose={() => setShowContextMenu(false)}
        >
            <Button
                onClick={() => onClick(vault)}
                onContextMenu={() => setShowContextMenu(true)}
                title={`${vault.name} (${vault.state})`}
            >
                <Icon icon={vault.state === VaultSourceStatus.Unlocked ? "unlock" : "lock"} />
                {vault.name}
            </Button>
        </Popover>
    );
}
