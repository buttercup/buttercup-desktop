import * as React from "react";
import styled from "styled-components";
import { Alignment, Button, ButtonGroup } from "@blueprintjs/core";

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
    const { onSelect: handleSelection, selected: selectedItem } = props;
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
                    title="Vault contents"
                />
                <Button
                    disabled
                    icon="diagnosis"
                    large
                    minimal
                />
                <Button
                    disabled
                    icon="console"
                    large
                    minimal
                />
                <Button
                    icon="more"
                    large
                    minimal
                />
            </ButtonGroup>
        </SidebarContainer>
    );
}
