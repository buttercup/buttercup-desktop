import * as React from "react";
import styled from "styled-components";
import { useState } from "@hookstate/core";
import { VAULTS_LIST } from "../../state/vaults";

const SidebarContainer = styled.div`
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

export function VaultsSidebar() {
    const vaultsState = useState(VAULTS_LIST);
    return (
        <SidebarContainer>

        </SidebarContainer>
    );
}
