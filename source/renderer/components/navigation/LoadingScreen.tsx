import * as React from "react";
import styled from "styled-components";
import { Intent, Spinner } from "@blueprintjs/core";
import { useState } from "@hookstate/core";
import { BUSY } from "../../state/app";

const LoadingContainer = styled.div<{ visible: boolean }>`
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999999999;
    display: ${(props: any) => props.visible ? "flex" : "none"};
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export function LoadingScreen() {
    const busyState = useState(BUSY);
    return (
        <LoadingContainer visible={busyState.get()}>
            <Spinner size={100} intent={Intent.PRIMARY} />
        </LoadingContainer>
    );
}
