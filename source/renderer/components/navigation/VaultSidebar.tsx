import * as React from "react";
import styled from "styled-components";
import { Alignment, Button, ButtonGroup } from "@blueprintjs/core";

const SidebarContainer = styled.div`
    width: 60px;
    padding: 10px 0px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;

export function VaultSidebar() {
    return (
        <SidebarContainer>
            <ButtonGroup
                alignText={Alignment.LEFT}
                minimal
                vertical
            >
                <Button
                    icon="control"
                    minimal
                    title="Vault contents"
                />
                <Button
                    disabled
                    icon="diagnosis"
                    minimal
                />
                <Button
                    disabled
                    icon="console"
                    minimal
                />
                <Button
                    icon="more"
                    minimal
                />
            </ButtonGroup>
        </SidebarContainer>
    );
}
