import * as React from "react";
import styled from "styled-components";
import { VaultsSidebar } from "./navigation/VaultsSidebar";

const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
`;

export function VaultManagement() {
    return (
        <PrimaryContainer>
            <VaultsSidebar />
        </PrimaryContainer>
    );
}
