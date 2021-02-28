import * as React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { VaultSidebar, VaultSidebarItem } from "./navigation/VaultSidebar";
import { VaultEditor } from "./VaultEditor";
import { ErrorBoundary } from "./ErrorBoundary";

const { useCallback, useState } = React;

const PrimaryContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
`;
const ContentContainer = styled.div`
    flex: 10 10 auto;
    height: 100%;
`;

export function VaultManagement() {
    const { id = null } = useParams();
    const [selectedSidebarItem, setSelectedSidebarItem] = useState<VaultSidebarItem>("contents");
    const handleSidebarItemSelect = useCallback((item: VaultSidebarItem) => {
        setSelectedSidebarItem(item);
    }, []);
    return (
        <PrimaryContainer>
            <VaultSidebar
                onSelect={item => handleSidebarItemSelect(item)}
                selected={selectedSidebarItem}
            />
            <ContentContainer>
                {id && (
                    <ErrorBoundary>
                        {selectedSidebarItem === "contents" && <VaultEditor sourceID={id} />}
                    </ErrorBoundary>
                )}
            </ContentContainer>

        </PrimaryContainer>
    );
}
