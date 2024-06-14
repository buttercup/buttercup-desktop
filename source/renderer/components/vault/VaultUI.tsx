import React from "react";
import { Allotment } from "allotment";
import styled from "styled-components";
import { EntriesList } from "./EntriesList";
import { EntryDetails } from "./EntryDetails";
import { GroupsList } from "./GroupsList";

import "./styles/vault-ui.sass";

const GridWrapper = styled.div`
    position: relative;
    height: 100%;
`;

export const VaultUI = () => {
    return (
        <GridWrapper>
            <Allotment>
                <Allotment.Pane>
                    <GroupsList />
                </Allotment.Pane>
                <Allotment.Pane className="split-pane-entries">
                    <EntriesList />
                </Allotment.Pane>
                <Allotment.Pane className="split-pane-entry-details">
                    <EntryDetails />
                </Allotment.Pane>
            </Allotment>
        </GridWrapper>
    );
};
