import * as React from "react";
import styled from "styled-components";
import { Icon } from "@blueprintjs/core";
import { VaultSourceStatus } from "buttercup";
import { getThemeProp } from "../../styles/theme";
import { VaultSourceDescription } from "../../../shared/types";

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
    return (
        <Button
            onClick={() => onClick(vault)}
            title={`${vault.name} (${vault.state})`}
        >
            <Icon icon={vault.state === VaultSourceStatus.Unlocked ? "unlock" : "lock"} />
            {vault.name}
        </Button>
    );
}
