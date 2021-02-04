import * as React from "react";
import styled from "styled-components";
import { Button, Card, Classes, Dialog, Elevation, Spinner } from "@blueprintjs/core";
import { useState } from "@hookstate/core";
import { SHOW_ADD_VAULT } from "../state/addVault";
import { setBusy } from "../state/app";
import { authDropbox } from "../actions/dropbox";
import { SourceType } from "../types";

// @todo remove
import { FileChooser } from "./standalone/FileChooser";

const ICON_BUTTERCUP = require("../../../resources/images/buttercup-file-256.png").default;
const ICON_DROPBOX = require("../../../resources/images/dropbox-256.png").default;
const ICON_GOOGLEDRIVE = require("../../../resources/images/googledrive-256.png").default;
const ICON_WEBDAV = require("../../../resources/images/webdav-256.png").default;

const { useCallback, useEffect } = React;

const PAGE_TYPE = "type";
const PAGE_AUTH = "auth";
const PAGE_CHOOSE = "choose";
const PAGE_CONFIRM = "confirm";

const VAULT_TYPES = [
    {
        title: "File",
        type: SourceType.File,
        icon: ICON_BUTTERCUP
    },
    {
        title: "Dropbox",
        type: SourceType.Dropbox,
        icon: ICON_DROPBOX
    },
    {
        title: "Google Drive",
        type: SourceType.GoogleDrive,
        icon: ICON_GOOGLEDRIVE
    },
    {
        title: "WebDAV",
        type: SourceType.WebDAV,
        icon: ICON_WEBDAV
    }
];

const DialogFreeWidth = styled(Dialog)`
    width: auto !important;
`;
const LoadingContainer = styled.div`
    width: 460px;
    height: 300px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
const TypeIcons = styled.div`
    margin: 18px 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
`;
const TypeIcon = styled(Card)`
    flex: 0 0 auto;
    width: 110px;
    margin: 8px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const TypeIconImage = styled.img`
    width: 80%;
    height: auto;
`;
const TypeText = styled.div`
    margin-top: 3px;
    width: 100%;
    text-align: center;
    color: grey;
`;

export function AddVaultMenu() {
    const showAddVaultState = useState(SHOW_ADD_VAULT);
    const previousShowAddVault = useState(false);
    const currentPage = useState(PAGE_TYPE);
    const selectedType = useState<SourceType>(null);
    const datasourcePayload = useState<{ [key: string]: any }>({});
    useEffect(() => {
        const newValue = showAddVaultState.get();
        if (previousShowAddVault.get() !== newValue) {
            previousShowAddVault.set(showAddVaultState.get());
            if (newValue) {
                currentPage.set(PAGE_TYPE);
            }
        }
    }, [showAddVaultState.get()]);
    const close = useCallback(() => {
        showAddVaultState.set(false);
    }, []);
    const handleVaultTypeClick = useCallback(async type => {
        selectedType.set(type);
        currentPage.set(PAGE_AUTH);
        if (type === SourceType.Dropbox) {
            setBusy(true);
            const token = await authDropbox();
            console.log("GOT TOKEN", token);
            setBusy(false);
            if (!token) {
                close();
                return;
            }
            datasourcePayload.set({
                ...datasourcePayload.get(),
                type,
                token
            });
        }
    }, []);
    // Pages
    const pageType = () => (
        <>
            <FileChooser callback={() => {}} fsInterface={null} />
            {/* <p>Choose a vault type to add:</p>
            <TypeIcons>
                {VAULT_TYPES.map(vaultType => (
                    <TypeIcon key={vaultType.type} interactive elevation={Elevation.TWO} onClick={() => handleVaultTypeClick(vaultType.type)}>
                        <TypeIconImage src={vaultType.icon} />
                        <TypeText>{vaultType.title}</TypeText>
                    </TypeIcon>
                ))}
            </TypeIcons> */}
        </>
    );
    const pageAuth = () => (
        <>
            {selectedType.get() === SourceType.Dropbox && (
                <LoadingContainer>
                    <i>A separate window will open for authentication</i>
                </LoadingContainer>
            )}
        </>
    );
    // Output
    return (
        <DialogFreeWidth isOpen={showAddVaultState.get()} onClose={close}>
            <div className={Classes.DIALOG_HEADER}>Add Vault</div>
            <div className={Classes.DIALOG_BODY}>
                {currentPage.get() === PAGE_TYPE && pageType()}
                {currentPage.get() === PAGE_AUTH && pageAuth()}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {/* <Button
                        intent={Intent.PRIMARY}
                        onClick={() => submitAndClose(currentPassword.get())}
                        title="Confirm vault unlock"
                    >
                        Unlock
                    </Button> */}
                    <Button
                        onClick={close}
                        title="Cancel Unlock"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </DialogFreeWidth>
    );
}
